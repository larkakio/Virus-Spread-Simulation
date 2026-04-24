import { Attribution } from 'ox/erc8021';
import type { Hex } from 'viem';
import { publicEnv } from '@/lib/envPublic';

/**
 * Builder attribution suffix for check-in (ERC-8021). See PROMPT and Base builder codes docs.
 */
export function getBuilderDataSuffix(): Hex | undefined {
  if (publicEnv.builderCodeSuffix?.startsWith('0x')) {
    return publicEnv.builderCodeSuffix;
  }
  if (!publicEnv.builderCode) return undefined;
  return Attribution.toDataSuffix({ codes: [publicEnv.builderCode] });
}
