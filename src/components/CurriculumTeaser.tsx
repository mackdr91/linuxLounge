import React from "react";
import Link from "next/link";
import { LESSONS } from "@/data/lessons";
import { ArrowRight, Terminal, Award, Clock, Sparkles } from "lucide-react";

export default function CurriculumTeaser() {
  return (
    <section className="relative w-full py-20 px-6 sm:px-12 border-t border-zinc-850 bg-black">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-850 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs text-cyan-400 font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Curriculum Preview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              5 Hands-On Production Labs
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
              Zero fluff. Each lab puts you inside an Ubuntu server terminal with automated objective validation and AI assistance.
            </p>
          </div>

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 5 Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              className="group flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 hover:border-emerald-500/50 hover:bg-zinc-900/60 transition shadow-lg backdrop-blur-sm"
            >
              <div className="space-y-3">
                {/* Badge Row */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">LAB {String(lesson.number).padStart(2, "0")}</span>
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded-full">
                    <Award className="h-3 w-3" />
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition font-sans">
                  {lesson.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {lesson.tagline}
                </p>

                {/* Cheat Sheet Command Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {lesson.cheatSheet.slice(0, 3).map((cs) => (
                    <span
                      key={cs.command}
                      className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-300"
                    >
                      {cs.command}
                    </span>
                  ))}
                  {lesson.cheatSheet.length > 3 && (
                    <span className="rounded bg-zinc-900/50 px-1.5 py-0.5 text-[11px] font-mono text-zinc-500">
                      +{lesson.cheatSheet.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer / CTA */}
              <div className="pt-6 mt-4 border-t border-zinc-850/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{lesson.estimatedMinutes} mins</span>
                </div>

                <Link
                  href={`/learn/${lesson.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Start Lab</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}

          {/* Bonus Lab Teaser Card */}
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-5 text-center items-center justify-center space-y-4">
            <div className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-500">
              <Sparkles className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-300">More Advanced Labs In Progress</h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                Networking, iptables firewalls, Docker daemon management & Bash scripting.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400/80">Coming Q4 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
