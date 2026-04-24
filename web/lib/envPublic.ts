/**
 * Public env (NEXT_PUBLIC_*) for client. Fallbacks for local preview where unset.
 */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://virus-spread-simulation-jet.vercel.app',
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 8453),
  checkInAddress: (process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
  baseAppId: process.env.NEXT_PUBLIC_BASE_APP_ID || '69eb0e0ae67b282fc52d2a01',
  builderCode: process.env.NEXT_PUBLIC_BUILDER_CODE || '',
  builderCodeSuffix: process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX as `0x${string}` | undefined,
};

export function isCheckInConfigured(): boolean {
  return (
    publicEnv.checkInAddress.length === 42 &&
    publicEnv.checkInAddress !==
      '0x0000000000000000000000000000000000000000'
  );
}
