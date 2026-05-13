import { startYogaTimer, stopYogaTimer } from '$lib/server/yoga-timer';

let started = false;

export function handle({ event, resolve }: { event: any; resolve: any }) {
  if (!started) {
    started = true;
    startYogaTimer();
  }

  return resolve(event);
}

export function handleServerError({ error }: { error: any }) {
  console.error('Server error:', error);
  return { message: 'Internal server error' };
}

process.on('SIGTERM', () => {
  stopYogaTimer();
  process.exit(0);
});

process.on('SIGINT', () => {
  stopYogaTimer();
  process.exit(0);
});
