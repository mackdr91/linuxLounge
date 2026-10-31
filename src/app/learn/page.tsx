"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Code,
  Shield,
  Layers,
  Search,
} from "lucide-react";
import { LESSONS } from "@/data/lessons";

export default function LessonCatalogPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("linux_lounge_completed_lessons");
      if (stored) {
        setCompletedLessons(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const totalXP = LESSONS.reduce((acc, l) => {
    return completedLessons.includes(l.id) ? acc + l.xpReward : acc;
  }, 0);

  const filtered = LESSONS.filter(
    (l) =>
      l.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.overview.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/90 px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 group-hover:border-emerald-500/50 transition">
              <Terminal className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100 font-mono">
              Linux Lounge
            </span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-amber-400">
              <Zap className="h-3.5 w-3.5 fill-amber-400" />
              <span>{totalXP} XP</span>
            </div>
            <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-400">
              {completedLessons.length} / {LESSONS.length} Completed
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Banner */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-400 font-mono">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>5-Stage Core Curriculum</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400">Gemini 3.8 AI Co-Pilot</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Linux Mastery Course
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Step through five progressive hands-on lessons with an interactive in-browser Linux terminal, live task verification, and automated AI assistance.
            </p>
          </div>
        </section>

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            All Lessons ({LESSONS.length})
          </span>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search lessons..."
              className="w-56 rounded-md border border-zinc-800 bg-zinc-950 pl-8 pr-3 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lesson) => {
            const isDone = completedLessons.includes(lesson.id);

            return (
              <Link
                key={lesson.id}
                href={`/learn/${lesson.slug}`}
                className={`group flex flex-col justify-between rounded-xl border p-5 transition ${
                  isDone
                    ? "border-emerald-500/30 bg-zinc-950/60 hover:border-emerald-500/50"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Lesson 0{lesson.number}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] uppercase font-semibold ${
                        lesson.difficulty === "Beginner"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : lesson.difficulty === "Intermediate"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {lesson.difficulty}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {lesson.title}
                  </h2>
                  <p className="mt-1 text-xs font-mono text-emerald-400/80">
                    {lesson.tagline}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                    {lesson.overview}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-850 pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.estimatedMinutes}m
                    </span>
                    <span className="text-amber-400">+{lesson.xpReward} XP</span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold font-sans">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-zinc-400 group-hover:text-white font-sans transition">
                      Start <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
