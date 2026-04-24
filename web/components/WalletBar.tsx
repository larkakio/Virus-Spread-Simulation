'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

const baseId = base.id;

export function WalletBar() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const wrong = isConnected && chainId != null && chainId !== baseId;

  return (
    <div className="w-full max-w-4xl space-y-2">
      {wrong && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"
        >
          <span>Wrong network. Switch to Base to check in and play on-chain.</span>
          <button
            type="button"
            className="rounded border border-amber-400/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100 hover:bg-amber-500/20"
            onClick={() => switchChain({ chainId: baseId })}
            disabled={isSwitching}
          >
            {isSwitching ? 'Switching…' : 'Switch to Base'}
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!isConnected && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              reset();
            }}
            className="cyber-button px-4 py-2 text-sm font-bold uppercase tracking-wider"
          >
            Connect wallet
          </button>
        )}

        {isConnected && address && (
          <>
            <span className="font-mono text-xs text-cyan-200/90">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded border border-fuchsia-500/40 px-2 py-1 text-xs text-fuchsia-200/90 hover:bg-fuchsia-500/10"
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      {open && !isConnected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-zinc-950/95 p-4 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                Wallets
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="mb-3 text-xs text-zinc-400">
              Base will be selected when possible. You can use Base Account,
              browser wallet, or WalletConnect.
            </p>
            <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto">
              {connectors.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-left text-sm text-cyan-100 hover:border-cyan-400/50"
                    onClick={async () => {
                      try {
                        await connect({ connector: c, chainId: baseId });
                        setOpen(false);
                      } catch {
                        // user cancel — ignore
                      }
                    }}
                    disabled={isPending}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
            {isPending && (
              <p className="mt-2 text-center text-xs text-zinc-500">
                Requesting…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
