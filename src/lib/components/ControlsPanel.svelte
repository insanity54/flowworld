<script lang="ts">
  import { soundManager } from '$lib/client/sound';
  import { onMount, onDestroy } from 'svelte';

  let {
    pose,
    isDark,
    membershipEnabled = $bindable(false),
    clientCount = 0,
    fx = $bindable({ color: '#00FF00' }),
    sessionId = '',
    membershipsDisabled = false,
  } = $props();

  const PERSIST_KEY = 'flowworld-prefs';

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {};
  }

  function savePrefs() {
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify({
        difficulty, voiceEnabled, voiceVolume, voiceCounter,
        musicEnabled, musicVolume, color,
      }));
    } catch { /* ignore */ }
  }

  const prefs = loadPrefs();
  let difficulty = $state(prefs.difficulty ?? 'beginner');
  let voiceEnabled = $state(prefs.voiceEnabled ?? true);
  let voiceVolume = $state(prefs.voiceVolume ?? 0.8);
  let voiceCounter = $state(prefs.voiceCounter ?? false);
  let musicEnabled = $state(prefs.musicEnabled ?? false);
  let musicVolume = $state(prefs.musicVolume ?? 0.5);
  let color = $state(prefs.color ?? '#ffffff');
  let debugJson = $state('{}');

  let lnInvoiceId: string | null = $state(null);
  let lnBolt11: string | null = $state(null);
  let lnStatus: 'idle' | 'loading' | 'pending' | 'error' = $state('idle');
  let lnError: string | null = $state(null);
  let lnAmountSats: number = $state(2000);
  let lnShowCustom = $state(false);
  let copied = $state(false);
  let qrCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let pollingTimer: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    debugJson = JSON.stringify({ pose, clientCount }, null, 2);
  });

  $effect(() => { soundManager.voiceEnabled = voiceEnabled; });
  $effect(() => { soundManager.voiceVolume = voiceVolume; });
  $effect(() => { soundManager.voiceCounter = voiceCounter; });
  $effect(() => { soundManager.musicEnabled = musicEnabled; });
  $effect(() => { soundManager.musicVolume = musicVolume; });

  $effect(() => {
    JSON.stringify({ difficulty, voiceEnabled, voiceVolume, voiceCounter, musicEnabled, musicVolume, color });
    fx.color = color;
    savePrefs();
  });

  onMount(() => {
    if (localStorage.getItem('flowworld-member') === 'true') {
      membershipEnabled = true;
    }
  });

  $effect(() => {
    if (sessionId && !membershipEnabled && !membershipsDisabled && lnStatus === 'idle') {
      createInvoice(2000);
    }
  });

  $effect(() => {
    if (lnStatus === 'pending' && lnBolt11 && qrCanvas) {
      import('qrcode').then(({ default: QRCode }) => {
        QRCode.toCanvas(qrCanvas, lnBolt11!, { width: 220, margin: 1 });
      }).catch(() => {});
    }
  });

  onDestroy(() => {
    stopPolling();
  });

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  async function createInvoice(sats?: number) {
    if (!sessionId) return;
    const amount = Math.max(1, Math.round(sats ?? lnAmountSats));
    lnAmountSats = amount;
    stopPolling();
    lnStatus = 'loading';
    lnError = null;
    try {
      const res = await fetch('/api/ln/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, amountSats: amount }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      lnInvoiceId = data.invoiceId;
      lnBolt11 = data.BOLT11;
      lnStatus = 'pending';
      startPolling();
    } catch (e) {
      lnError = e instanceof Error ? e.message : 'Failed to create invoice';
      lnStatus = 'error';
    }
  }

  function startPolling() {
    stopPolling();
    pollingTimer = setInterval(async () => {
      if (!lnInvoiceId) return;
      try {
        const res = await fetch('/api/ln/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId: lnInvoiceId }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'Settled' || data.status === 'Complete') {
          stopPolling();
          lnStatus = 'idle';
          membershipEnabled = true;
          localStorage.setItem('flowworld-member', 'true');
        }
        if (data.status === 'Expired' || data.status === 'Invalid') {
          stopPolling();
          lnError = 'Invoice expired. Please try again.';
          lnStatus = 'error';
        }
      } catch { /* polling error */ }
    }, 3000);
  }

  async function copyBolt11() {
    if (!lnBolt11) return;
    try {
      await navigator.clipboard.writeText(lnBolt11);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch { /* clipboard unavailable */ }
  }
</script>

<div class="controls-panel">
  <div class="p-3">
    <div class="card p-3 mb-3 shadow-sm">
      <div class="mb-3">
        <label for="difficulty" class="form-label small">Difficulty</label>
        <select class="form-select form-select-sm" id="difficulty" bind:value={difficulty}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="voiceEnabled" bind:checked={voiceEnabled}>
        <label class="form-check-label fw-bold small" for="voiceEnabled">Voice Prompts</label>
      </div>

      {#if voiceEnabled}
        <div class="mb-3">
          <label for="voiceVolume" class="form-label small">Voice Volume</label>
          <input type="range" class="form-range" id="voiceVolume" min="0.01" max="1" step="0.01" bind:value={voiceVolume}>
        </div>

        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" id="voiceCounter" bind:checked={voiceCounter}>
          <label class="form-check-label small" for="voiceCounter">Pose Counter</label>
        </div>
      {/if}

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="bgmEnabled" bind:checked={musicEnabled}>
        <label class="form-check-label fw-bold small" for="bgmEnabled">Music</label>
      </div>

      {#if musicEnabled}
        <div class="mb-3">
          <label for="bgmVolume" class="form-label small">Music Volume</label>
          <input type="range" class="form-range" id="bgmVolume" min="0.01" max="1" step="0.01" bind:value={musicVolume}>
        </div>
      {/if}
    </div>
  </div>

  {#if membershipEnabled}
    <div class="p-3 border-top">
      <h2 class="h5 mb-3">Personalization</h2>
      <div class="card p-3 mb-3 shadow-sm">
        <div class="mb-3">
          <label for="fxColor" class="form-label small">Color Tint</label>
          <input type="color" class="form-control form-control-color form-control-sm" id="fxColor" bind:value={color} style="width:100%;height:38px">
        </div>
      </div>
    </div>
  {/if}

  {#if import.meta.env.DEV}
    <div class="p-3 border-top">
      <h2 class="h5 mb-3">Debug data</h2>
      <p class="small text-muted"><i>This section is only visible in development environment</i></p>
      <div class="mb-3">
        <label for="membership" class="form-label small">Membership Enabled</label>
        <input type="checkbox" class="form-check-input ms-2" id="membership" bind:checked={membershipEnabled}>
      </div>
      <p class="small mb-1">Session ID: {sessionId}</p>
      <p class="small mb-1">Connected clients: {clientCount}</p>
      <pre class="small bg-dark text-light p-2 rounded"><code>{debugJson}</code></pre>
    </div>
  {/if}

  <div class="p-3 border-top text-center small">
    <h2 class="h5">About</h2>
    <p>multiplayer.yoga is a worldwide yoga experience.</p>
    <p>Each pose lasts 42 seconds. All visitors see the same pose at the same time.</p>
    <p>There is no beginning, there is no end. Join any time and find your flow.</p>
    <p>There are no logins, no usernames, no reputation to build. The focus here is presence.</p>
    <p>Poses are chosen randomly with weighted probabilities, guiding the flow toward transitions that feel natural.</p>
    <p>No streaks, no scores, no leaderboards. This isn't a game or a race, it's a space to build focus, grow stronger, and find calm.</p>

    <hr>

    <h2 class="h5">Credits</h2>
    <p>Music created by <a class="text-warning" target="_blank" href="https://linktr.ee/TEMPHUiBIS">TEMPHUiBIS</a></p>

    <hr>

    <h2 class="h5">Author</h2>
    <p>Hi I'm <a target="_blank" href="https://grimtech.net">Chris Grimmett</a>, author of multiplayer.yoga.</p>
    <img class="img-fluid rounded" alt="Chris Grimmett, author of multiplayer.yoga" src="/chris2.jpg" style="max-width:200px">
    <p class="mt-2">My dream is to support myself through building apps and websites that help people in their daily lives.</p>
    {#if membershipEnabled}
      <p>You are a member of multiplayer.yoga. Thank you so much!</p>
    {:else}
      <p>If you've found value here and want to support its continued growth, please consider becoming a member.</p>
    {/if}
    <p>Thank you for being here.</p>
  </div>

  {#if !membershipEnabled}
    <div class="p-3 border-top">
      <h2 class="h5 mb-3">Membership</h2>
      <div class="card p-3 mb-0 shadow-sm small">
        {#if membershipsDisabled}
          <p class="text-center text-muted mb-0">Memberships temporarily disabled</p>
        {:else if lnStatus === 'idle' || lnStatus === 'loading'}
          <p class="text-center">Creating invoice...</p>
          <div class="text-center">
            <div class="spinner-border spinner-border-sm" role="status"></div>
          </div>
        {:else if lnStatus === 'pending'}
          <p class="text-center mb-2"><strong>Pay {lnAmountSats.toLocaleString()} sats with any Lightning wallet</strong></p>
          <div class="d-flex justify-content-center mb-2">
            <canvas bind:this={qrCanvas} width="220" height="220" style="width:220px;height:220px;"></canvas>
          </div>
          {#if lnBolt11}
            <div class="input-group input-group-sm mb-2">
              <input type="text" class="form-control form-control-sm font-monospace small" value={lnBolt11} readonly>
              <button class="btn btn-outline-light btn-sm" onclick={copyBolt11}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          {/if}
          <p class="text-center text-muted small mb-0">
            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
            Waiting for payment...
          </p>
          <hr class="my-2">
          {#if lnShowCustom}
            <label for="customAmount" class="form-label small">Custom amount (sats)</label>
            <div class="input-group input-group-sm">
              <input type="number" id="customAmount" class="form-control" min="1" bind:value={lnAmountSats}>
              <button class="btn btn-outline-light" onclick={() => { lnShowCustom = false; createInvoice(); }}>Update</button>
            </div>
          {:else}
            <button class="btn btn-outline-light btn-sm w-100" onclick={() => lnShowCustom = true}>Name your own price</button>
          {/if}
        {:else if lnStatus === 'error'}
          <p class="text-danger mb-2">{lnError || 'Something went wrong.'}</p>
          <button class="btn btn-outline-light btn-sm w-100" onclick={() => createInvoice()}>
            Retry
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .controls-panel {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-bottom: 12rem;
  }
  .controls-panel::-webkit-scrollbar {
    width: 6px;
  }
  .controls-panel::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
</style>
