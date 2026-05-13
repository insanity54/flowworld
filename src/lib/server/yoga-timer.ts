import { getDb } from './db';
import { broadcast } from './realtime';
import { poses, poseNeighbors, flows } from './db/schema';
import { eq, desc, sql, inArray } from 'drizzle-orm';

interface PoseRow {
  id: string;
  name: string;
  displayName: string;
  rarity: number;
}

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
    const db = getDb();

    const latest = db.select()
      .from(flows)
      .orderBy(desc(flows.createdAt))
      .limit(1)
      .get();

    if (!latest) {
      const firstPose = db.select()
        .from(poses)
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .get();

      if (firstPose) {
        createFlow(firstPose.id, 'global42');
      }
      return;
    }

    const neighborRows = db.select()
      .from(poseNeighbors)
      .where(eq(poseNeighbors.poseId, latest.poseId))
      .all();

    if (neighborRows.length === 0) {
      const randomPose = db.select()
        .from(poses)
        .where(sql`id != ${latest.poseId}`)
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .get();

      if (randomPose) {
        createFlow(randomPose.id, latest.channel);
      }
      return;
    }

    const neighborPoses = db.select()
      .from(poses)
      .where(inArray(poses.id, neighborRows.map(n => n.neighborId)))
      .all() as PoseRow[];

    let totalWeight = 0;
    for (const pose of neighborPoses) {
      const rarity = Math.max(1, pose.rarity);
      totalWeight += 1 / rarity;
    }

    if (totalWeight <= 0) {
      const fallback = neighborPoses[0];
      if (fallback) createFlow(fallback.id, latest.channel);
      return;
    }

    const randomWeight = Math.random() * totalWeight;
    let cumulative = 0;
    let selected: PoseRow | null = null;

    for (const pose of neighborPoses) {
      const rarity = Math.max(1, pose.rarity);
      cumulative += 1 / rarity;
      if (cumulative >= randomWeight) {
        selected = pose;
        break;
      }
    }

    if (!selected) {
      selected = neighborPoses[neighborPoses.length - 1];
    }

    if (selected) {
      createFlow(selected.id, latest.channel);
    }
  } catch (err) {
    console.error('yoga-timer: error selecting next pose', err);
  }
}

function createFlow(poseId: string, channel: string): void {
  const db = getDb();
  const id = crypto.randomUUID();
  db.insert(flows).values({ id, poseId, channel }).run();

  const pose = db.select()
    .from(poses)
    .where(eq(poses.id, poseId))
    .get() as PoseRow;

  if (pose) {
    broadcast('pose', {
      id: pose.id,
      name: pose.name,
      displayName: pose.displayName,
    });
  }
}
