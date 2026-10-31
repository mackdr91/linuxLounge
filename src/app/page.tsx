"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Code,
  Flame,
  CheckCircle2,
  Award,
} from "lucide-react";
import TerminalTypingCanvas from "@/components/TerminalTypingCanvas";
import InteractiveHeroTerminal from "@/components/InteractiveHeroTerminal";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import CurriculumTeaser from "@/components/CurriculumTeaser";
import FeatureTrio from "@/components/FeatureTrio";
import ObjectionKillingFAQ from "@/components/ObjectionKillingFAQ";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasClaimableXp, setHasClaimableXp] = useState(false);

  useEffect(() => {
    const checkXp = () => {
      try {
        const val = localStorage.getItem("linux_lounge_hero_xp");
        if (val) setHasClaimableXp(true);
      } catch {}
    };
    checkXp();
    window.addEventListener("storage", checkXp);
    return () => window.removeEventListener("storage", checkXp);
  }, []);

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
    <div className="relative min-h-screen w-full bg-black font-sans text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. HERO SECTION WITH ADAPTIVE VERTICAL RHYTHM (NOT CONSTRAINED RIGIDLY TO 100VH) */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Background Video Layer */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center filter brightness-90 contrast-125 pointer-events-none"
        >
          <source src="/terminal-bg.mp4" type="video/mp4" />
        </video>

        {/* Interactive Animated Typing Terminal Simulation Layer */}
        <TerminalTypingCanvas />

        {/* 60% Black Overlay (Explicit constraint maintained) */}
        <div
          className="absolute inset-0 bg-black/60 pointer-events-none"
          aria-hidden="true"
        />

        {/* Vignette Gradient */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]"
          aria-hidden="true"
        />

        {/* Sticky Header HUD */}
        <header className="relative z-20 flex h-16 w-full items-center justify-between px-6 sm:px-12 border-b border-zinc-800/40 backdrop-blur-[2px]">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-zinc-100 hover:text-white transition group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/80 group-hover:border-emerald-500/50 shadow-machined transition">
              <Terminal className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100 font-mono">
              Linux Lounge
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-xs font-mono text-zinc-300 hover:text-emerald-400 transition hidden sm:inline-block"
            >
              Curriculum (5 Labs)
            </Link>

            {/* Video Play/Pause Control */}
            <button
              onClick={toggleVideoPlayback}
              aria-label={isPlaying ? "Pause background video" : "Play background video"}
              className="flex items-center gap-2 rounded-full border border-zinc-750 bg-black/60 px-3 py-1 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition backdrop-blur-sm shadow-machined"
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
          </div>
        </header>

        {/* Adaptive Hero Container */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14 text-center max-w-5xl mx-auto w-full">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-750 bg-zinc-950/85 px-4 py-1.5 text-xs text-zinc-300 font-mono shadow-machined backdrop-blur-md mb-5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Hands-on Ubuntu Server Sandbox</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">Gemini 3.8 AI Co-Pilot</span>
          </div>

          {/* H1 Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans max-w-4xl">
            Master Linux From the Command Line.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              No Videos. No Fluff.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-xs sm:text-base text-zinc-300 font-normal leading-relaxed">
            Ditch 40-hour lecture playlists. Practice real commands inside a safe in-browser virtual filesystem with real-time AI error diagnosis and automated lab verification.
          </p>

          {/* Dynamic Personalized Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6 w-full sm:w-auto">
            <Link
              href="/learn/the-shell-awakening"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-bold text-black transition shadow-bevel-glow"
            >
              <Terminal className="h-4 w-4" />
              {hasClaimableXp ? (
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 fill-black" />
                  <span>Claim Your +50 XP in Lesson 1</span>
                </span>
              ) : (
                <span>Launch Lesson 1: Free (No Login Needed)</span>
              )}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#curriculum"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-black/60 hover:bg-zinc-900 px-5 py-3.5 text-sm font-medium text-zinc-200 transition backdrop-blur-md shadow-machined"
            >
              <Code className="h-4 w-4 text-zinc-400" />
              <span>Explore 5 Production Labs ↓</span>
            </a>
          </div>

          {/* Product-Led Proof: Embedded Interactive Terminal Hero Widget */}
          <div className="w-full mt-10">
            <InteractiveHeroTerminal />
          </div>
        </div>

        {/* Social Proof & Credibility Bar */}
        <div className="relative z-20 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md py-4 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% In-Browser POSIX Emulation</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Zero Local VirtualBox or Dual-Boot Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Gemini 3.8 Flash Terminal Diagnosis</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE OLD WAY VS LINUX LOUNGE COMPARISON MATRIX */}
      <ComparisonMatrix />

      {/* 3. TRANSPARENT 5-LESSON CURRICULUM PREVIEW */}
      <div id="curriculum">
        <CurriculumTeaser />
      </div>

      {/* 4. DEEP-DIVE TECHNICAL FEATURE TRIO */}
      <FeatureTrio />

      {/* 5. OBJECTION-KILLING FAQ & FINAL CTA */}
      <ObjectionKillingFAQ />

      {/* Footer */}
      <footer className="w-full border-t border-zinc-850 bg-black py-8 px-6 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>Linux Lounge • Interactive Command-Line Learning</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <Link href="/learn" className="hover:text-zinc-300 transition">
              All Lessons
            </Link>
            <Link href="/learn/the-shell-awakening" className="hover:text-zinc-300 transition">
              Launch Sandbox
            </Link>
            <a
              href="https://github.com/mackdr91/linuxLounge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
