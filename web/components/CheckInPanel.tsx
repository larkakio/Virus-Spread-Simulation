'use client';

import { useState } from 'react';
import {
  useAccount,
  useWriteContract,
  useSwitchChain,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { checkInAbi } from '@/lib/contracts/checkIn';
import { getBuilderDataSuffix } from '@/lib/builderCode';
import { isCheckInConfigured, publicEnv } from '@/lib/envPublic';

const baseId = base.id;

export function CheckInPanel() {
  const { isConnected, chainId, address } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const canWrite =
    isConnected && isCheckInConfigured() && address;
  const busy = isSwitching || isWriting;
  const wrong = isConnected && chainId != null && chainId !== baseId;

  async function onCheckIn() {
    setErr(null);
    setOk(null);
    if (!address || !canWrite) return;
    try {
      if (chainId !== baseId) {
        await switchChainAsync({ chainId: baseId });
      }
      const hash = await writeContractAsync({
        address: publicEnv.checkInAddress,
        abi: checkInAbi,
        functionName: 'checkIn',
        value: 0n,
        chainId: baseId,
        dataSuffix: getBuilderDataSuffix(),
      });
      setOk(`Sent: ${hash.slice(0, 10)}…`);
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Check-in failed';
      setErr(m);
    }
  }

  return (
    <div className="cyber-glass w-full max-w-sm space-y-2 p-4">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/90">
        Daily on-chain check-in
      </h3>
      <p className="text-xs text-zinc-400">
        One check-in per UTC day on Base. You only pay L2 gas.
      </p>
      {!isCheckInConfigured() && (
        <p className="text-xs text-amber-200/80">
          Contract address not set in deployment env (preview mode).
        </p>
      )}
      <button
        type="button"
        onClick={onCheckIn}
        disabled={!canWrite || wrong || busy}
        className="cyber-button w-full py-2 text-sm font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        {wrong
          ? 'Switch to Base first'
          : busy
            ? isSwitching
              ? 'Switching…'
              : 'Signing…'
            : 'Check in on Base'}
      </button>
      {ok && <p className="break-all text-xs text-emerald-400/90">{ok}</p>}
      {err && <p className="break-all text-xs text-red-400/90">{err}</p>}
    </div>
  );
}
