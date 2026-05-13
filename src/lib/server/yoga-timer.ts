import { broadcast } from './realtime';
import { poseMap } from './poses';

let lastPoseId: string | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

export function startYogaTimer(): void {
  const intervalMs = parseInt(process.env.POSE_INTERVAL || '42000', 10);
  intervalId = setInterval(selectNextPose, Math.max(1000, intervalMs));
  selectNextPose();
}

export function stopYogaTimer(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function selectNextPose(): void {
  try {
    const allIds = Object.keys(poseMap);

    if (!lastPoseId) {
      const id = allIds[Math.floor(Math.random() * allIds.length)];
      lastPoseId = id;
      broadcastPose(id);
      return;
    }

    const current = poseMap[lastPoseId];
    const candidates = current?.neighbors?.length ? current.neighbors : allIds.filter(id => id !== lastPoseId);

    let totalWeight = 0;
    for (const id of candidates) {
      const pose = poseMap[id];
      const rarity = pose ? Math.max(1, pose.rarity) : 1;
      totalWeight += 1 / rarity;
    }

    const randomWeight = Math.random() * totalWeight;
    let cumulative = 0;
    let selected: string | null = null;

    for (const id of candidates) {
      const pose = poseMap[id];
      const rarity = pose ? Math.max(1, pose.rarity) : 1;
      cumulative += 1 / rarity;
      if (cumulative >= randomWeight) {
        selected = id;
        break;
      }
    }

    if (!selected) selected = candidates[candidates.length - 1];
    lastPoseId = selected;
    broadcastPose(selected);
  } catch (err) {
    console.error('yoga-timer: error selecting next pose', err);
  }
}

function broadcastPose(id: string): void {
  const pose = poseMap[id];
  broadcast('pose', {
    id,
    name: pose.name,
    displayName: pose.displayName,
  });
}
