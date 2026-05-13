<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let poses = $derived(data.poses);

  let selectedId = $state<string | null>(null);
  let selectedPose = $derived(poses.find(p => p.id === selectedId) ?? null);

  function selectPose(id: string) {
    selectedId = selectedId === id ? null : id;
  }

  let centerX = 400;
  let centerY = 350;
  let radius = Math.min(260, poses.length * 30);

  function nodePos(i: number) {
    const a = (i / poses.length) * Math.PI * 2 - Math.PI / 2;
    return { x: centerX + Math.cos(a) * radius, y: centerY + Math.sin(a) * radius };
  }

  let positions = $derived(poses.map((_, i) => nodePos(i)));

  function getNeighborEdges() {
    const edges: Array<{ from: number; to: number }> = [];
    for (let i = 0; i < poses.length; i++) {
      for (const nId of poses[i].neighbors) {
        const j = poses.findIndex(p => p.id === nId);
        if (j > i) edges.push({ from: i, to: j });
      }
    }
    return edges;
  }

  let edges = $derived(getNeighborEdges());

  function rarityColor(r: number) {
    const colors = ['#22cc66', '#44aaff', '#ffaa00', '#ff5500', '#ff0055'];
    return colors[Math.min(r - 1, colors.length - 1)];
  }
</script>

<svelte:head>
  <title>Poses — multiplayer.yoga</title>
</svelte:head>

<div class="d-flex vh-100">
  <div class="flex-grow-1 position-relative overflow-hidden bg-dark">
    <svg width="100%" height="100%" viewBox="0 0 800 700" class="position-absolute top-0 start-0">
      {#each edges as e}
        <line
          x1={positions[e.from].x} y1={positions[e.from].y}
          x2={positions[e.to].x} y2={positions[e.to].y}
          stroke="rgba(255,255,255,0.15)" stroke-width="1.5"
        />
      {/each}
      {#each poses as pose, i (pose.id)}
        {@const pos = positions[i]}
        <g onclick={() => selectPose(pose.id)} style="cursor: pointer;" class="node-group">
          <circle
            cx={pos.x} cy={pos.y} r="14"
            fill={selectedId === pose.id ? rarityColor(pose.rarity) : 'rgba(255,255,255,0.1)'}
            stroke={selectedId === pose.id ? '#fff' : rarityColor(pose.rarity)}
            stroke-width={selectedId === pose.id ? 3 : 2}
          />
          <text x={pos.x} y={pos.y + 28} text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10" font-family="sans-serif">
{pose.displayName}
          </text>
        </g>
      {/each}
    </svg>
  </div>

  <div class="border-start" style="width: 360px; overflow-y: auto; background: var(--bs-body-bg);">
    <div class="p-3 border-bottom">
      <h5 class="mb-0">Pose Editor</h5>
      <small class="text-muted">{poses.length} poses</small>
    </div>

    {#if selectedPose}
      <div class="p-3">
        <form method="post" action="?/update" use:enhance>
          <input type="hidden" name="id" value={selectedPose.id} />
          <div class="mb-2">
            <label class="form-label small">Name (slug)</label>
            <input type="text" class="form-control form-control-sm" value={selectedPose.name} disabled />
          </div>
          <div class="mb-2">
            <label class="form-label small">Display Name</label>
            <input type="text" name="display_name" class="form-control form-control-sm" value={selectedPose.displayName} required />
          </div>
          <div class="mb-2">
            <label class="form-label small">Rarity</label>
            <input type="number" name="rarity" class="form-control form-control-sm" min="1" max="5" value={selectedPose.rarity} />
          </div>
          <div class="mb-2">
            <label class="form-label small">Difficulty</label>
            <select name="difficulty" class="form-select form-select-sm">
              <option value="beginner" selected={selectedPose.difficulty === 'beginner'}>Beginner</option>
              <option value="intermediate" selected={selectedPose.difficulty === 'intermediate'}>Intermediate</option>
              <option value="advanced" selected={selectedPose.difficulty === 'advanced'}>Advanced</option>
              <option value="expert" selected={selectedPose.difficulty === 'expert'}>Expert</option>
            </select>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary btn-sm flex-grow-1">Save</button>
            <button class="btn btn-outline-danger btn-sm" formaction="?/deletePose">Delete</button>
          </div>
        </form>

        <hr />

        <h6 class="small">Neighbors</h6>
        <ul class="list-unstyled small mb-2">
          {#each selectedPose.neighbors as nId}
            {@const n = poses.find(p => p.id === nId)}
            <li class="d-flex justify-content-between align-items-center py-1">
              <span>{n?.displayName ?? nId}</span>
              <form method="post" action="?/removeNeighbor" use:enhance>
                <input type="hidden" name="pose_id" value={selectedPose.id} />
                <input type="hidden" name="neighbor_id" value={nId} />
                <button class="btn btn-outline-light btn-sm py-0 px-1">&times;</button>
              </form>
            </li>
          {/each}
        </ul>

        <form method="post" action="?/addNeighbor" use:enhance>
          <input type="hidden" name="pose_id" value={selectedPose.id} />
          <div class="input-group input-group-sm">
            <select name="neighbor_id" class="form-select form-select-sm">
              <option value="">Add neighbor...</option>
              {#each poses.filter(p => p.id !== selectedPose.id && !selectedPose.neighbors.includes(p.id)) as pose}
                <option value={pose.id}>{pose.displayName}</option>
              {/each}
            </select>
            <button class="btn btn-outline-light btn-sm">+</button>
          </div>
        </form>
      </div>
    {:else}
      <div class="p-3">
        <h6 class="small">New Pose</h6>
        <form method="post" action="?/create" use:enhance>
          <div class="mb-2">
            <label class="form-label small">Name (slug)</label>
            <input type="text" name="name" class="form-control form-control-sm" required placeholder="e.g. downwardDog" />
          </div>
          <div class="mb-2">
            <label class="form-label small">Display Name</label>
            <input type="text" name="display_name" class="form-control form-control-sm" required placeholder="e.g. Downward Dog" />
          </div>
          <div class="mb-2">
            <label class="form-label small">Rarity</label>
            <input type="number" name="rarity" class="form-control form-control-sm" min="1" max="5" value="1" />
          </div>
          <div class="mb-2">
            <label class="form-label small">Difficulty</label>
            <select name="difficulty" class="form-select form-select-sm">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <button class="btn btn-success btn-sm w-100">Create Pose</button>
        </form>
      </div>
    {/if}
  </div>
</div>

<style>
  .node-group:hover circle {
    stroke: #fff !important;
    stroke-width: 3 !important;
  }
</style>
