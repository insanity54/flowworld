<script lang="ts">
  let { pose }: { pose: { id: string; name: string; displayName: string } | null } = $props();
</script>

{#if pose}
  <div class="yoga-pose">
    <h1 class="display-3 fw-bold text-white">{pose.displayName}</h1>
  </div>
{/if}
