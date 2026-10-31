"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  Pause,
  ArrowRight,
  Shield,
  Sparkles,
  Layers,
  Code,
  BookOpen,
  Cpu,
} from "lucide-react";
import TerminalTypingCanvas from "@/components/TerminalTypingCanvas";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-sans text-zinc-100">
      {/* 1. Background Video Layer */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center filter brightness-90 contrast-125"
      >
        <source src="/terminal-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. Interactive Animated Typing Terminal Simulation Layer */}
      <TerminalTypingCanvas />

      {/* 3. Black Overlay at 60% (as explicitly requested: "black overlay at 60%") */}
      <div
        className="absolute inset-0 bg-black/60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle scanline / vignette texture */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"
        aria-hidden="true"
      />

      {/* 4. Top Navigation Bar */}
      <header className="relative z-20 flex h-16 w-full items-center justify-between px-6 sm:px-12 border-b border-zinc-800/40 backdrop-blur-[2px]">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-zinc-100 hover:text-white transition group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/80 group-hover:border-emerald-500/50 transition">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100 font-mono">
            Linux Lounge
          </span>
        </Link>

        {/* Video Play/Pause Control (Modern Web Guidance Accessibility Compliance) */}
        <button
          onClick={toggleVideoPlayback}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
          className="flex items-center gap-2 rounded-full border border-zinc-750 bg-black/60 px-3 py-1 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition backdrop-blur-sm"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] font-mono">Video Active</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 text-zinc-400" />
              <span className="text-[11px] font-mono">Paused</span>
            </>
          )}
        </button>
      </header>

      {/* 5. Center Hero Content (100vh Fill) */}
      <div className="relative z-20 flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-1 text-xs text-zinc-300 font-mono shadow-lg backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Master Ubuntu Server & Linux Administration</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">Gemini 3.8 AI Co-pilot</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Hands-On Linux.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Zero Guesswork.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Practice real terminal commands inside an interactive Linux sandbox. Get real-time AI error diagnosis, flag explanations, and guided certification roadmaps.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/learn/the-shell-awakening"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition shadow-[0_0_25px_rgba(16,185,129,0.35)]"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch Lesson 1: The Shell Awakening</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-black/60 hover:bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-200 transition backdrop-blur-md"
            >
              <Code className="h-4 w-4 text-zinc-400" />
              <span>Explore All 5 Lessons</span>
            </Link>
          </div>

          {/* Interactive Feature Highlights Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 text-xs text-zinc-400 font-mono">
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2.5 backdrop-blur-sm">
              <span className="block text-emerald-400 font-bold">23 Chapters</span>
              <span>Foundations to Root</span>
            </div>
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2.5 backdrop-blur-sm">
              <span className="block text-cyan-400 font-bold">AI Co-pilot</span>
              <span>Gemini 3.8 Flash</span>
            </div>
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2.5 backdrop-blur-sm">
              <span className="block text-amber-400 font-bold">Real Sandbox</span>
              <span>Virtual Filesystem</span>
            </div>
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2.5 backdrop-blur-sm">
              <span className="block text-rose-400 font-bold">Gamified XP</span>
              <span>Streaks & Badges</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
