import { b as broadcast } from './realtime-D5HdVqZU.js';
import { p as poseMap } from './poses-Dx6Of_Ri.js';

let lastPoseId = null;
let intervalId = null;
function startYogaTimer() {
  const intervalMs = parseInt(process.env.POSE_INTERVAL || "42000", 10);
  intervalId = setInterval(selectNextPose, Math.max(1e3, intervalMs));
  selectNextPose();
}
function stopYogaTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
function selectNextPose() {
  try {
    const allIds = Object.keys(poseMap);
    if (!lastPoseId) {
      const id = allIds[Math.floor(Math.random() * allIds.length)];
      lastPoseId = id;
      broadcastPose(id);
      return;
    }
    const current = poseMap[lastPoseId];
    const candidates = current?.neighbors?.length ? current.neighbors : allIds.filter((id) => id !== lastPoseId);
    let totalWeight = 0;
    for (const id of candidates) {
      const pose = poseMap[id];
      const rarity = pose ? Math.max(1, pose.rarity) : 1;
      totalWeight += 1 / rarity;
    }
    const randomWeight = Math.random() * totalWeight;
    let cumulative = 0;
    let selected = null;
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
    console.error("yoga-timer: error selecting next pose", err);
  }
}
function broadcastPose(id) {
  const pose = poseMap[id];
  broadcast("pose", {
    id,
    name: pose.name,
    displayName: pose.displayName
  });
}
let started = false;
function handle({ event, resolve }) {
  if (!started) {
    started = true;
    startYogaTimer();
  }
  return resolve(event);
}
function handleServerError({ error }) {
  console.error("Server error:", error);
  return { message: "Internal server error" };
}
process.on("SIGTERM", () => {
  stopYogaTimer();
  process.exit(0);
});
process.on("SIGINT", () => {
  stopYogaTimer();
  process.exit(0);
});

export { handle, handleServerError };
//# sourceMappingURL=hooks.server-CF1P41WE.js.map
