import { getDb } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { poses, poseNeighbors } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

type PoseRow = {
  id: string;
  name: string;
  displayName: string;
  rarity: number;
  difficulty: string;
  mirror: string | null;
};

function loadPoses() {
  const db = getDb();
  const poseRows = db.select().from(poses).orderBy(poses.name).all() as PoseRow[];

  const neighborRows = db.select().from(poseNeighbors).orderBy(poseNeighbors.poseId).all();

  const neighborsByPose = new Map<string, string[]>();
  for (const row of neighborRows) {
    const list = neighborsByPose.get(row.poseId) ?? [];
    list.push(row.neighborId);
    neighborsByPose.set(row.poseId, list);
  }

  return poseRows.map(p => ({
    ...p,
    neighbors: neighborsByPose.get(p.id) ?? [],
  }));
}

export function load() {
  return { poses: loadPoses() };
}

export const actions = {
  async create({ request }) {
    const data = await request.formData();
    const name = data.get('name') as string;
    const display_name = data.get('display_name') as string;
    const rarity = parseInt(data.get('rarity') as string) || 1;
    const difficulty = data.get('difficulty') as string || 'beginner';

    if (!name || !display_name) {
      return fail(400, { error: 'name and display_name are required' });
    }

    const db = getDb();
    try {
      db.insert(poses).values({
        id: name,
        name,
        displayName: display_name,
        rarity,
        difficulty,
      }).run();
    } catch (err: any) {
      return fail(409, { error: err.message });
    }

    return { success: true };
  },

  async update({ request }) {
    const data = await request.formData();
    const id = data.get('id') as string;
    const display_name = data.get('display_name') as string;
    const rarity = parseInt(data.get('rarity') as string) || 1;
    const difficulty = data.get('difficulty') as string || 'beginner';

    if (!id) return fail(400, { error: 'id required' });

    const db = getDb();
    db.update(poses)
      .set({ displayName: display_name, rarity, difficulty })
      .where(eq(poses.id, id))
      .run();

    return { success: true };
  },

  async deletePose({ request }) {
    const data = await request.formData();
    const id = data.get('id') as string;
    if (!id) return fail(400, { error: 'id required' });

    const db = getDb();
    db.delete(poseNeighbors)
      .where(sql`pose_id = ${id} OR neighbor_id = ${id}`)
      .run();
    db.delete(poses).where(eq(poses.id, id)).run();

    return { success: true };
  },

  async addNeighbor({ request }) {
    const data = await request.formData();
    const pose_id = data.get('pose_id') as string;
    const neighbor_id = data.get('neighbor_id') as string;

    if (!pose_id || !neighbor_id) return fail(400, { error: 'pose_id and neighbor_id required' });
    if (pose_id === neighbor_id) return fail(400, { error: 'pose cannot neighbor itself' });

    const db = getDb();
    try {
      db.insert(poseNeighbors).values({ poseId: pose_id, neighborId: neighbor_id }).run();
    } catch (err: any) {
      return fail(409, { error: err.message });
    }

    return { success: true };
  },

  async removeNeighbor({ request }) {
    const data = await request.formData();
    const pose_id = data.get('pose_id') as string;
    const neighbor_id = data.get('neighbor_id') as string;

    if (!pose_id || !neighbor_id) return fail(400, { error: 'pose_id and neighbor_id required' });

    const db = getDb();
    db.delete(poseNeighbors)
      .where(sql`pose_id = ${pose_id} AND neighbor_id = ${neighbor_id}`)
      .run();

    return { success: true };
  },
};
