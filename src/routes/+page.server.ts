import { env } from '$env/dynamic/private';

export function load() {
  return {
    membershipsDisabled: env.MEMBERSHIPS_DISABLED === 'true' || env.MEMBERSHIPS_DISABLED === '1',
  };
}
