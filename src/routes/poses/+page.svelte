<script lang="ts">
  import type { Pose } from '$lib/server/poses';

  let { data } = $props();
  let poses: Pose[] = $derived(data.poses);

  let selectedId = $state<string | null>(null);
  let selectedPose = $derived(poses.find(p => p.name === selectedId) ?? null);

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
        const j = poses.findIndex(p => p.name === nId);
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
      {#each poses as pose, i (pose.name)}
        {@const pos = positions[i]}
        <g onclick={() => selectPose(pose.name)} style="cursor: pointer;" class="node-group">
          <circle
            cx={pos.x} cy={pos.y} r="14"
            fill={selectedId === pose.name ? rarityColor(pose.rarity) : 'rgba(255,255,255,0.1)'}
            stroke={selectedId === pose.name ? '#fff' : rarityColor(pose.rarity)}
            stroke-width={selectedId === pose.name ? 3 : 2}
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
      <h5 class="mb-0">Pose Reference</h5>
      <small class="text-muted">{poses.length} poses</small>
    </div>

    {#if selectedPose}
      <div class="p-3">
        <h6>{selectedPose.displayName}</h6>
        <table class="table table-sm small mb-2">
          <tbody>
            <tr><td class="text-muted">Name</td><td>{selectedPose.name}</td></tr>
            <tr><td class="text-muted">Rarity</td><td>{selectedPose.rarity}</td></tr>
            <tr><td class="text-muted">Difficulty</td><td>{selectedPose.difficulty}</td></tr>
            <tr><td class="text-muted">Mirror</td><td>{selectedPose.mirror || '—'}</td></tr>
            <tr><td class="text-muted">Neighbors</td><td>{selectedPose.neighbors.length}</td></tr>
          </tbody>
        </table>
        <details class="small">
          <summary class="text-muted">Neighbor list</summary>
          <ul class="list-unstyled mt-1 mb-0">
            {#each selectedPose.neighbors as nId}
              <li>{nId}</li>
            {/each}
          </ul>
        </details>
      </div>
    {:else}
      <div class="p-3">
        <table class="table table-sm small">
          <thead>
            <tr>
              <th>Pose</th>
              <th>R</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {#each poses as pose (pose.name)}
              <tr onclick={() => selectPose(pose.name)} style="cursor:pointer;" class={selectedId === pose.name ? 'table-active' : ''}>
                <td>{pose.displayName}</td>
                <td>
                  <span class="badge" style="background:{rarityColor(pose.rarity)}">{pose.rarity}</span>
                </td>
                <td class="text-capitalize">{pose.difficulty}</td>
              </tr>
            {/each}
          </tbody>
        </table>
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
