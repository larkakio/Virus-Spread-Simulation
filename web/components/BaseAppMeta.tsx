import { publicEnv } from '@/lib/envPublic';

/**
 * Base.dev domain verification: explicit meta in head (PROMPT).
 */
export function BaseAppMeta() {
  return (
    <meta name="base:app_id" content={String(publicEnv.baseAppId || '0')} />
  );
}
