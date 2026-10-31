"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Sparkles, CheckCircle2, Play, CornerDownLeft, RotateCcw } from "lucide-react";
import { createInitialVM, executeCommand, VirtualMachineState } from "@/lib/virtualTerminal";

interface QuickCmd {
  label: string;
  command: string;
  desc: string;
}

const QUICK_COMMANDS: QuickCmd[] = [
  { label: "Check OS Release", command: "cat /etc/os-release", desc: "Inspect Ubuntu distribution metadata" },
  { label: "List Root Directory", command: "ls -la /", desc: "View Unix Filesystem Hierarchy (FHS)" },
  { label: "Search Passwd File", command: "grep sysadmin /etc/passwd", desc: "Filter user credentials with grep" },
  { label: "System Health & Memory", command: "free -h", desc: "Check memory allocation" },
];

export default function InteractiveHeroTerminal() {
  const [vm, setVm] = useState<VirtualMachineState>(createInitialVM);
  const [logs, setLogs] = useState<Array<{ type: "input" | "output" | "error"; text: string }>>([
    {
      type: "output",
      text: "Linux Lounge Virtual Terminal v2.4 (Ubuntu 24.04 LTS)\nType 'help' or click a quick command below to test the live sandbox.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [completedDemoTask, setCompletedDemoTask] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runCommandStr = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const res = executeCommand(vm, trimmed);
    const newLogs = [...logs, { type: "input" as const, text: `$ ${trimmed}` }];

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

    setLogs(newLogs);
    setInputVal("");

    // Check if user ran the challenge command
    if (trimmed.includes("grep") && trimmed.includes("passwd")) {
      setCompletedDemoTask(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommandStr(inputVal);
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
    setCompletedDemoTask(false);
  };

  return (
    <div className="w-full max-w-4xl rounded-xl border border-zinc-700/80 bg-zinc-950/90 shadow-2xl backdrop-blur-md overflow-hidden text-left font-mono">
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
              Demo Lab Solved! (+50 XP)
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
        className="h-56 sm:h-64 overflow-y-auto p-4 text-[13px] leading-relaxed space-y-1.5 bg-black/75 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {logs.map((log, idx) => (
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
        ))}
      </div>

      {/* Input Prompt */}
      <div className="flex items-center border-t border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5">
        <span className="text-emerald-400 mr-2 text-xs select-none">
          sysadmin@ubuntu:{vm.cwd === "/home/sysadmin" ? "~" : vm.cwd}$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Try typing 'ls -la' or 'grep sysadmin /etc/passwd'..."
          className="flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
        <button
          onClick={() => runCommandStr(inputVal)}
          className="ml-2 inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2 py-1 text-[11px] text-zinc-300 transition"
        >
          <span>Run</span>
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </div>

      {/* Quick Action Chips (Product-Led Proof) */}
      <div className="border-t border-zinc-800/60 bg-zinc-950/90 px-4 py-2.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1 text-zinc-400">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            Quick Test Commands (Click to Execute):
          </span>
          <span className="text-zinc-500 hidden sm:inline">Zero login required</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_COMMANDS.map((qc) => (
            <button
              key={qc.command}
              onClick={() => runCommandStr(qc.command)}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 hover:border-emerald-500/50 hover:bg-zinc-850 px-2.5 py-1 text-[11px] text-zinc-300 hover:text-emerald-300 transition"
              title={qc.desc}
            >
              <Play className="h-2.5 w-2.5 text-emerald-400" />
              <code className="text-emerald-300/90">{qc.command}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
