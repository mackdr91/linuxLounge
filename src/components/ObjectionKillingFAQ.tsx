"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ChevronUp, Terminal, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Is this a toy simulator or does it run real Linux commands?",
    answer:
      "Linux Lounge incorporates a stateful in-memory POSIX filesystem that faithfully emulates Ubuntu 24.04 LTS hierarchy (`/etc`, `/var`, `/home`, `/usr`). It models real file permissions (rwx/octal), ownership (root vs sysadmin), process management (systemctl status/restart), pipes (`|`), and stream redirection (`>`, `>>`).",
  },
  {
    question: "Do I need to install VirtualBox, WSL, or Docker to use this?",
    answer:
      "Zero installation required. The entire sandbox runs client-side in your web browser with sub-millisecond execution latency. No ISO downloads, no VM disk allocations, and no risk to your host operating system.",
  },
  {
    question: "How does the Gemini 3.8 AI Co-Pilot work?",
    answer:
      "Whenever you execute a command, our built-in Gemini 3.8 Flash assistant can break down every flag and parameter. If you hit a permission error or invalid syntax, the AI diagnoses the exact root cause and suggests hints without spoiling the lab objective.",
  },
  {
    question: "Is it completely free to start?",
    answer:
      "Yes! All 5 core labs are 100% free with no credit card or account creation required. You can jump directly into Lesson 1 in less than 3 seconds.",
  },
  {
    question: "Will this prepare me for certifications like LFCS or CompTIA Linux+?",
    answer:
      "Absolutely. The curriculum covers foundational and intermediate domains tested in Linux Foundation Certified System Administrator (LFCS) and RHCSA, including file permissions, stream processing with grep, and systemd service administration.",
  },
];

export default function ObjectionKillingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative w-full py-20 px-6 sm:px-12 border-t border-zinc-850 bg-black">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-3.5 py-1 text-xs text-zinc-300 font-mono">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Clear Answers For Skeptical Developers
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            Everything you need to know about our browser execution sandbox and AI co-pilot.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-zinc-200 hover:text-white transition"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-850">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final High-Converting Bottom CTA Banner */}
        <div className="relative rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/50 via-zinc-950 to-zinc-950 p-8 sm:p-10 shadow-2xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="space-y-2 z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Ready to upgrade your command line fluency?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Start Lesson 1 Right Now
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Zero login. Zero configuration. Open your terminal in under 3 seconds.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link
              href="/learn/the-shell-awakening"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-bold text-black transition shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch Sandbox</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
