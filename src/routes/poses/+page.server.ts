import { poseList } from '$lib/server/poses';
import type { Pose } from '$lib/server/poses';

export function load(): { poses: Pose[] } {
  return { poses: poseList };
}
