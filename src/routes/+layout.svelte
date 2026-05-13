<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    defer></script>
</svelte:head>

<div class="container-fluid p-0">
  {#if children}
    {@render children()}
  {/if}
</div>
