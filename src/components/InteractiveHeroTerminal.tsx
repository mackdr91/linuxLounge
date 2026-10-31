"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Terminal as TerminalIcon,
  Sparkles,
  CheckCircle2,
  Play,
  CornerDownLeft,
  RotateCcw,
  ArrowRight,
  Zap,
} from "lucide-react";
import { createInitialVM, executeCommand, VirtualMachineState } from "@/lib/virtualTerminal";
import { soundEffects } from "@/lib/soundEffects";

interface QuickCmd {
  label: string;
  command: string;
  desc: string;
  isChallenge?: boolean;
}

const QUICK_COMMANDS: QuickCmd[] = [
  {
    label: "⚡ Quick Challenge (+50 XP): grep sysadmin /etc/passwd",
    command: "grep sysadmin /etc/passwd",
    desc: "Target challenge: Filter credentials from passwd",
    isChallenge: true,
  },
  {
    label: "Check OS Release",
    command: "cat /etc/os-release",
    desc: "Inspect Ubuntu distribution metadata",
  },
  {
    label: "List Root Directory",
    command: "ls -la /",
    desc: "View Unix Filesystem Hierarchy (FHS)",
  },
  {
    label: "System Health & Memory",
    command: "free -h",
    desc: "Check memory allocation",
  },
];

interface LogEntry {
  type: "input" | "output" | "error" | "banner";
  text: string;
}

export default function InteractiveHeroTerminal() {
  const [vm, setVm] = useState<VirtualMachineState>(createInitialVM);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: "output",
      text: "Linux Lounge Virtual Terminal v2.4 (Ubuntu 24.04 LTS)\nType 'help' or click a quick command below to test the live sandbox.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [completedDemoTask, setCompletedDemoTask] = useState(false);
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load guest XP status from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("linux_lounge_hero_xp");
      if (saved) {
        setCompletedDemoTask(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const executeActualCommand = (trimmed: string) => {
    const res = executeCommand(trimmed, vm);
    const newLogs: LogEntry[] = [...logs, { type: "input", text: `$ ${trimmed}` }];

    if (res.clear) {
      setLogs([]);
      setInputVal("");
      return;
    }

    if (res.output) {
      newLogs.push({ type: "output", text: res.output });
    }
    if (res.error) {
      newLogs.push({ type: "error", text: res.error });
    }

    // Check if user ran the challenge command
    if (trimmed.includes("grep") && trimmed.includes("passwd")) {
      newLogs.push({
        type: "banner",
        text: "CHALLENGE_SOLVED",
      });
      if (!completedDemoTask) {
        setCompletedDemoTask(true);
        soundEffects.playTaskSuccess();
        try {
          localStorage.setItem("linux_lounge_hero_xp", "50");
          window.dispatchEvent(new Event("storage"));
        } catch {}
      }
    }

    setLogs(newLogs);
    setInputVal("");
  };

  // Animated typewriter simulation for clicking quick chips (20ms/char)
  const triggerTypewriterRun = (targetCmd: string) => {
    if (isTypingAnimation) return;
    setIsTypingAnimation(true);
    setInputVal("");

    let currentIdx = 0;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIdx++;
      soundEffects.playKeyClick();
      setInputVal(targetCmd.slice(0, currentIdx));

      if (currentIdx >= targetCmd.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setTimeout(() => {
          setIsTypingAnimation(false);
          executeActualCommand(targetCmd);
        }, 120);
      }
    }, 20);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundEffects.playKeyClick();
    if (e.key === "Enter" && !isTypingAnimation) {
      const trimmed = inputVal.trim();
      if (trimmed) {
        executeActualCommand(trimmed);
      }
    }
  };

  const resetTerminal = () => {
    setVm(createInitialVM());
    setLogs([
      {
        type: "output",
        text: "Terminal reset. In-memory virtual filesystem restored to default state.",
      },
    ]);
    setInputVal("");
  };

  return (
    <div className="w-full max-w-4xl rounded-xl border border-zinc-700/80 bg-terminal-canvas shadow-2xl backdrop-blur-md overflow-hidden text-left font-mono shadow-inner-bezel">
      {/* Top Chrome / Window Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-xs text-zinc-400 font-sans flex items-center gap-1.5 font-medium">
            <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
            sysadmin@ubuntu-server: ~ (Live Sandbox)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {completedDemoTask && (
            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-full animate-pulse">
              <CheckCircle2 className="h-3 w-3" />
              Demo Solved! (+50 XP)
            </span>
          )}
          <button
            onClick={resetTerminal}
            title="Reset Terminal"
            aria-label="Reset Terminal"
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="h-56 sm:h-64 overflow-y-auto p-4 text-[13px] leading-relaxed space-y-2 bg-terminal-canvas scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {logs.map((log, idx) => {
          if (log.type === "banner") {
            return (
              <div
                key={idx}
                className="my-2 rounded-lg border border-emerald-500/50 bg-gradient-to-r from-emerald-950/60 to-zinc-950 p-3 text-xs font-sans text-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-glow-emerald"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>[ ✔ ] Challenge Solved! You earned +50 XP.</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono">
                    Virtual filesystem inspected & validated matching entry for sysadmin.
                  </p>
                </div>
                <Link
                  href="/learn/the-shell-awakening"
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-bold text-black transition shrink-0"
                >
                  <span>Claim +50 XP & Enter Lesson 1</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={
                log.type === "input"
                  ? "text-emerald-400 font-semibold"
                  : log.type === "error"
                  ? "text-rose-400"
                  : "text-zinc-300 whitespace-pre-wrap font-light"
              }
            >
              {log.text}
            </div>
          );
        })}
      </div>

      {/* Input Prompt */}
      <div className="flex items-center border-t border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5">
        <span className="text-emerald-400 mr-2 text-xs select-none">
          sysadmin@ubuntu:{vm.cwd === "/home/sysadmin" ? "~" : vm.cwd}$
        </span>
        <input
          type="text"
          value={inputVal}
          disabled={isTypingAnimation}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTypingAnimation
              ? "Typing..."
              : "Try typing 'ls -la' or click the amber challenge chip..."
          }
          className="flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-80"
        />
        <button
          onClick={() => {
            if (!isTypingAnimation && inputVal.trim()) {
              executeActualCommand(inputVal.trim());
            }
          }}
          disabled={isTypingAnimation || !inputVal.trim()}
          className="ml-2 inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-[11px] text-zinc-300 transition"
        >
          <span>Run</span>
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </div>

      {/* Quick Action Chips (Product-Led Proof with Typewriter Animation) */}
      <div className="border-t border-zinc-800/60 bg-zinc-950/90 px-4 py-2.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1 text-zinc-400">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            Quick Test Commands (Click to Type & Run):
          </span>
          <span className="text-zinc-500 hidden sm:inline">Zero login required</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_COMMANDS.map((qc) => (
            <button
              key={qc.command}
              disabled={isTypingAnimation}
              onClick={() => triggerTypewriterRun(qc.command)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] transition shadow-inner-bezel disabled:opacity-50 ${
                qc.isChallenge
                  ? "border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 hover:border-amber-400 font-semibold"
                  : "border-zinc-800 bg-zinc-900/80 hover:border-emerald-500/50 hover:bg-zinc-850 text-zinc-300 hover:text-emerald-300"
              }`}
              title={qc.desc}
            >
              {qc.isChallenge ? (
                <Zap className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
              ) : (
                <Play className="h-2.5 w-2.5 text-emerald-400" />
              )}
              <code>{qc.isChallenge ? qc.label : qc.command}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
