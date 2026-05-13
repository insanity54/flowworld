<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import YogaPose from '$lib/components/YogaPose.svelte';
  import ControlsPanel from '$lib/components/ControlsPanel.svelte';
  import { soundManager } from '$lib/client/sound';

  let { data } = $props();

  let pose = $state<{ id: string; name: string; displayName: string } | null>(null);
  let isDark = $state(true);
  let settingsOpen = $state(false);
  let membershipEnabled = $state(false);
  const savedColor = (() => { try { return JSON.parse(localStorage.getItem('flowworld-prefs') ?? '{}').color; } catch { return null; } })();
  let fx = $state({ color: savedColor || '#ffffff' });

  let sessionId = $state<string | null>(null);
  let localPlayerReady = $state(false);
  let sessions = $state<Array<{ id: string; color: string }>>([]);

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  }

  function connectSSE() {
    const es = new EventSource('/api/realtime');
    es.addEventListener('connected', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        sessionId = data.id;
        localPlayerReady = true;
      } catch {}
    });
    es.addEventListener('pose', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        pose = data;
        soundManager.onPose(data.name);
      } catch {}
    });
    es.addEventListener('clients', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.sessions) sessions = data.sessions;
      } catch {}
    });
    es.onerror = () => {};
    return es;
  }

  let cleanup: (() => void) | null = null;

  onMount(() => {
    const es = connectSSE();
    const hbInterval = setInterval(() => {
      if (!sessionId) return;
      fetch('/api/heartbeat', {
        method: 'POST',
        body: JSON.stringify({ id: sessionId }),
      }).catch(() => {});
    }, 5000);
    cleanup = () => {
      clearInterval(hbInterval);
      if (colorPostTimeout) clearTimeout(colorPostTimeout);
      es.close();
    };
  });

  onDestroy(() => cleanup?.());

  let remoteSessions = $derived(sessions.filter(s => s.id !== sessionId));
  let remoteCount = $derived(remoteSessions.length);

  function remotePos(i: number, n: number) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * 200, y: Math.sin(a) * 200 };
  }

  let colorPostTimeout: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    const c = fx.color;
    if (sessionId && c) {
      if (colorPostTimeout) clearTimeout(colorPostTimeout);
      colorPostTimeout = setTimeout(() => {
        fetch('/api/color', {
          method: 'POST',
          body: JSON.stringify({ id: sessionId, color: c }),
        }).catch(() => {});
      }, 300);
    }
  });
</script>

<svelte:head>
  <title>multiplayer.yoga</title>
</svelte:head>

<audio src="/void.mp3" autoplay class="d-none"></audio>

<div class="position-relative vh-100 overflow-hidden bg-dark">
  <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px;">
    {#each remoteSessions as remote, i (remote.id)}
      {@const pos = remotePos(i, remoteCount)}
      <div
        class="position-absolute rounded-circle remote-circle"
        style="left: calc(50% + {pos.x}px); top: calc(50% + {pos.y}px); width: 28px; height: 28px; margin-left: -14px; margin-top: -14px; background: {remote.color}; opacity: 0.6; border: 2px solid {remote.color};"
      ></div>
    {/each}
    {#if localPlayerReady}
      <div
        class="position-absolute rounded-circle local-circle"
        style="left: 50%; top: 50%; width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; background: {fx.color}; opacity: 0.8; border: 3px solid {fx.color}; box-shadow: 0 0 20px {fx.color}80;"
      ></div>
    {:else}
      <div class="text-secondary small">Connecting...</div>
    {/if}
  </div>

  <div class="position-relative z-1 h-100 d-flex flex-column">
    <header class="d-flex justify-content-end align-items-start p-3">
      <div class="d-flex gap-2">
        <button class="btn btn-outline-light btn-sm rounded-pill" onclick={() => settingsOpen = !settingsOpen}>Settings</button>
      </div>
    </header>
    <div class="mt-auto p-3"><YogaPose {pose} /></div>
  </div>
</div>

{#if settingsOpen}
  <div class="position-fixed top-0 end-0 z-3 h-100" style="width: 360px; background: var(--bs-body-bg);">
    <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
      <span class="fw-bold">Settings</span>
      <button title="settings" class="btn-close" onclick={() => settingsOpen = false}></button>
    </div>
    <ControlsPanel {pose} {isDark} bind:membershipEnabled bind:fx clientCount={remoteCount + 1} sessionId={sessionId ?? ''} membershipsDisabled={data.membershipsDisabled} />
  </div>
{/if}

<style>
  .remote-circle {
    transition: left 0.4s ease, top 0.4s ease, background-color 0.3s ease, border-color 0.3s ease;
  }
  .local-circle {
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
</style>
