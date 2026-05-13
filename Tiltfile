load('ext://helm_resource', 'helm_resource', 'helm_repo')
load('ext://secret', 'secret_create_generic')

secret_create_generic(
    name="flowworld",
    namespace="yoga",
    secret_type='Opaque',
    from_env_file='./.env.development.local'
)

docker_build(
    'ghcr.io/insanity54/flowworld',
    '.',
    dockerfile='development.Dockerfile',
    only=['src/', 'pb_public/', 'pb_hooks/', 'package.json', 'bun.lock', 'svelte.config.js', 'vite.config.ts', 'tsconfig.json'],
    ignore=['pb_data/', 'node_modules/', 'go.mod', 'go.sum', 'main.go'],
    live_update=[
      sync('./src', '/app/src'),
      sync('./static', '/app/static'),
      run('bun install', trigger=['./package.json', './bun.lock']),
    ]
)

helm_resource(
    'flowworld',
    'charts/flowworld',
    namespace='yoga',
    image_deps=['ghcr.io/insanity54/flowworld'],
    image_keys=[('image.repository', 'image.tag')],
    labels=['app'],
    flags=[
        '--create-namespace',
        '--set', 'env.POSE_INTERVAL=4200',
        '--set', 'env.PORT=8095',
        '--set', 'envFromSecret=flowworld',
    ]
)

k8s_resource('flowworld', port_forwards='8095:8095')
