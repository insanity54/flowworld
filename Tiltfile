docker_build(
    'ghcr.io/insanity54/flowworld',
    '.',
    dockerfile='development.Dockerfile',
    live_update=[
        sync('./src', '/app/src'),
        sync('./static', '/app/static'),
        sync('./package.json', '/app/package.json'),
        sync('./svelte.config.js', '/app/svelte.config.js'),
        sync('./vite.config.ts', '/app/vite.config.ts'),
        sync('./tsconfig.json', '/app/tsconfig.json'),
    ]
)

docker_compose('./docker-compose.yml')
