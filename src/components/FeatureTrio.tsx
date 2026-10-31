import React from "react";
import { Cpu, ShieldCheck, Sparkles, Terminal, CheckCircle } from "lucide-react";

export default function FeatureTrio() {
  const features = [
    {
      icon: Terminal,
      title: "Stateful In-Memory Filesystem",
      subtitle: "Full POSIX directory hierarchy with pipes & redirection",
      color: "emerald",
      points: [
        "Faithfully replicates `/etc`, `/var/log`, `/home/sysadmin`",
        "Supports bash pipes (`|`), redirection (`>`, `>>`), and history (`↑`, `↓`)",
        "Runs 100% in client memory — zero latency, zero server lag",
      ],
    },
    {
      icon: Sparkles,
      title: "Gemini 3.8 AI Terminal Co-Pilot",
      subtitle: "Instant flag explanations & contextual debugging",
      color: "cyan",
      points: [
        "Breaks down complex flags (`chmod -R 755`, `ps aux | grep`)",
        "Diagnoses permission denied and missing directory errors",
        "Integrated AI Tutor slide-over drawer gives hints without spoiling answers",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Automated Lab Verification Engine",
      subtitle: "Real-time task checkers and gamified XP rewards",
      color: "amber",
      points: [
        "Live regex & state inspects your virtual filesystem on every command",
        "Instant XP points, level progression, and completion badges",
        "Progress is automatically stored and synced locally",
      ],
    },
  ];

  return (
    <section className="relative w-full py-20 px-6 sm:px-12 border-t border-zinc-850 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs text-purple-400 font-mono">
            <Cpu className="h-3.5 w-3.5" />
            <span>Built For Serious Developers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered For Pure Muscle Memory
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to master production Linux administration, packaged into an instant browser experience.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition"
              >
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-lg border border-zinc-750 bg-zinc-950 flex items-center justify-center text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">{feat.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{feat.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-300">
                  {feat.points.map((pt, pidx) => (
                    <li key={pidx} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
