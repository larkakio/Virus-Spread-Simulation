import { WalletBar } from "@/components/WalletBar";
import { CheckInPanel } from "@/components/CheckInPanel";
import { VirusGame } from "@/components/game/VirusGame";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-4 px-3 pb-8 pt-4 sm:px-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-cyan-200 sm:text-3xl">
            Virus Spread Simulation
          </h1>
          <p className="mt-1 max-w-xl text-pretty text-sm text-sky-200/60">
            Swipe the field to send a photon-treatment wave from that edge, then
            the strain spreads. Clear all infection before the sector overloads
            or time runs out.
          </p>
        </div>
        <WalletBar />
      </header>

      <VirusGame />

      <div className="mt-auto">
        <CheckInPanel />
      </div>
    </main>
  );
}
