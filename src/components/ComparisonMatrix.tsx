import React from "react";
import { Check, X, ShieldAlert, Sparkles, Terminal, Flame } from "lucide-react";

interface MatrixRow {
  feature: string;
  youtube: string;
  vms: string;
  linuxLounge: string;
  isPositive?: boolean;
}

const COMPARISONS: MatrixRow[] = [
  {
    feature: "Learning Format",
    youtube: "Passive 40-hour video playlists",
    vms: "Complicated ISO configs & disk partitioning",
    linuxLounge: "Hands-on browser terminal with instant feedback",
  },
  {
    feature: "Risk of Bricking System",
    youtube: "None (because you never actually type)",
    vms: "High risk of wiping local partitions/bootloader",
    linuxLounge: "Zero (Safe, isolated in-memory Linux filesystem)",
  },
  {
    feature: "When You Get Stuck",
    youtube: "Stale StackOverflow threads from 2014",
    vms: "Debugging cryptic BIOS & hypervisor errors",
    linuxLounge: "Gemini 3.8 AI Co-Pilot explains errors & flags in real-time",
  },
  {
    feature: "Feedback & Validation",
    youtube: "Blind guesswork — no way to know if right",
    vms: "Manual inspection & no guided checkpoints",
    linuxLounge: "Automated regex lab verification with instant XP rewards",
  },
  {
    feature: "Time to First Command",
    youtube: "15 minutes of intro & sponsor shoutouts",
    vms: "45-60 minutes downloading Ubuntu ISOs",
    linuxLounge: "< 3 seconds (No downloads, zero signup required)",
  },
];

export default function ComparisonMatrix() {
  return (
    <section className="relative w-full py-20 px-6 sm:px-12 border-t border-zinc-850 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs text-emerald-400 font-mono">
            <Flame className="h-3.5 w-3.5" />
            <span>Escape Tutorial Hell</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Stop Watching. <span className="text-emerald-400">Start Breaking Code.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-sm sm:text-base leading-relaxed">
            Developers don't learn by watching somebody else type in 1080p. See how active sandbox practice transforms your muscle memory.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-400">
                <th className="p-4 sm:p-5 font-semibold">Aspect</th>
                <th className="p-4 sm:p-5 font-medium text-zinc-400">YouTube / Video Courses</th>
                <th className="p-4 sm:p-5 font-medium text-zinc-400">Local VMs & Dual Boot</th>
                <th className="p-4 sm:p-5 font-bold text-emerald-400 bg-emerald-950/30 border-l border-r border-emerald-800/40">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="h-4 w-4" />
                    <span>Linux Lounge</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4 sm:p-5 font-medium text-zinc-200">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>{row.youtube}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{row.vms}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-100 font-medium bg-emerald-950/20 border-l border-r border-emerald-800/30">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{row.linuxLounge}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
