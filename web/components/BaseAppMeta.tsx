import { publicEnv } from '@/lib/envPublic';

/**
 * Base.dev domain verification: explicit meta in head (PROMPT).
 */
export function BaseAppMeta() {
  return (
    <meta name="base:app_id" content={String(publicEnv.baseAppId || '69eb0e0ae67b282fc52d2a01')} />
  );
}
