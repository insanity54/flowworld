# Agent Policy Notes

## env var loading

load env vars like this

    import { env } from '$env/dynamic/private';
    exampleFunctionCall(env.EXAMPLE_VARIABLE)

not like this

    import { EXAMPLE_VARIABLE } from '$env/static/private';

## image_refs is not a thing.

The following is wrong. Don't use image_refs inside helm_resource(). It's not real, it's your imagination or outdated info. Omit image_refs entirely.

```starlark
helm_resource(
    'flowworld',
    'charts/flowworld',
    namespace='yoga',
    labels=['app'],
    image_refs=['ghcr.io/insanity54/flowworld'],
    flags=[
        '--create-namespace',
        '--set', 'env.POSE_INTERVAL=4200',
        '--set', 'env.PORT=8095',
    ],
)
```


## `tilt up` is wrong.

Never run `tilt up` or suggest the user runs it. All you need to do is change the app source code, and Tilt will reconcile your changes.


## Tiltfile — `helm_resource` import

In `Tiltfile`, the following line must never be changed:

```
load('ext://helm_resource', 'helm_resource', 'helm_repo')
```

It loads from `ext://helm_resource`, NOT `ext://helm_remote`. Do not "fix" this — it is correct and working.


## Debugging lessons (hard-won)

### Infinite loops with `while` + array length

Never do `while (arr.length > N)` unless you mutate `arr` inside the loop body. If `arr.length` never changes, it's an infinite loop that freezes the tab. Use a fixed-iteration `for` loop instead:

```
// WRONG — infinite loop if desiredCount <= 0:
while (clientModels.length > desiredCount) { /* no arr mutation */ }

// RIGHT:
for (let i = clientModels.length - 1; i >= Math.max(0, desiredCount); i--) { ... }
```

Always clamp `desiredCount` with `Math.max(0, desiredCount)` before using it as a removal threshold.

### SSE `controller.enqueue()` can throw

When a client disconnects, the next `controller.enqueue()` call on that detached `ReadableStreamDefaultController` throws. If this is inside an interval with no try/catch, it crashes the **entire server process**, taking all connections down. Always wrap interval-based enqueue calls:

```
try { controller.enqueue(...) } catch {}
```

### EventSource auto-reconnects

Do NOT implement manual reconnection logic in `onerror`. EventSource already auto-reconnects on connection loss. Calling `eventSource.close()` + `setTimeout(connectSSE, 3000)` in `onerror` creates duplicate connections.

### `event.platform` may be undefined

In SvelteKit server endpoints, `event.platform` is undefined in some environments (e.g., dev server without platform-specific adapter). Destructuring it throws, erroring the entire SSE stream. Remove platform-dependent code, don't try to "fix" it.

### `SkinnedMesh.clone(true)` shares skeleton reference

Calling `clone(true)` on a `SkinnedMesh` creates a deep copy of geometry/materials but the skeleton is still shared by reference. Calling `clone.bind(clone.skeleton)` on the clone can corrupt shared bone matrix state and crash the tab. Just skip the `bind()` call — the clone inherits correct skinning without it.

### Three.js post-processing types are unreliable

`UnrealBloomPass`, `FilmPass`, `EffectComposer`, etc. have outdated or missing TypeScript types in `@types/three`. Avoid them unless you're prepared to write manual type declarations. If they break, remove completely — don't try to patch.

### Bun Docker image needs write access

When using `oven/bun` image with a non-root `bun` user, Vite needs write access to create temp files. Add `RUN chown -R bun:bun /app` after `COPY` in the Dockerfile.

### Vite dev server binding

In containerized dev environments, Vite must bind to `0.0.0.0` or kubelet probes can't reach it via pod IP. Set `server.host: '0.0.0.0'` in the Vite config.

## Naming conventions

- **localPlayer** — the current user's full-scale character at the center
- **remotePlayers** — 1/6-scale characters arranged in a circle representing other connected users
- Never use the word "clone" or "cloneModel" in variable names, function names, or comments

## Naming conventions

- **localPlayer** — the current user's full-scale character at the center
- **remotePlayers** — 1/6-scale characters arranged in a circle representing other connected users
- Never use the word "clone" or "cloneModel" in variable names, function names, or comments
