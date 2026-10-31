"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Terminal as TerminalIcon,
  Sparkles,
  RotateCcw,
  Bot,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  createInitialVM,
  executeCommand,
  VirtualMachineState,
} from "@/lib/virtualTerminal";
import { LabTask } from "@/types/lesson";

interface TerminalEmulatorProps {
  lessonTitle: string;
  tasks: LabTask[];
  completedTaskIds: string[];
  externalCommand: string | null;
  onExternalCommandConsumed: () => void;
  onTaskCompleted: (taskId: string) => void;
  onOpenAiTutor: () => void;
  onCommandRun: (cmd: string, cwd: string) => void;
}

interface TerminalLine {
  id: string;
  type: "prompt" | "output" | "error" | "system";
  promptPrefix?: string;
  text: string;
}

export default function TerminalEmulator({
  lessonTitle,
  tasks,
  completedTaskIds,
  externalCommand,
  onExternalCommandConsumed,
  onTaskCompleted,
  onOpenAiTutor,
  onCommandRun,
}: TerminalEmulatorProps) {
  const [vm, setVm] = useState<VirtualMachineState>(() => createInitialVM());
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "boot-1",
      type: "system",
      text: "Linux Lounge Virtual Environment — Ubuntu 24.04 LTS (x86_64)",
    },
    {
      id: "boot-2",
      type: "system",
      text: "Type Linux commands (ls, cd, pwd, cat, chmod, systemctl...) or run tasks from the lesson pane.",
    },
  ]);
  const [input, setInput] = useState("");
  const [historyIdx, setHistoryIdx] = useState(-1);

  // AI Co-pilot state
  const [coPilotActive, setCoPilotActive] = useState(true);
  const [coPilotCard, setCoPilotCard] = useState<{
    command: string;
    explanation: string;
    loading: boolean;
    source?: string;
  } | null>(null);
  const [coPilotExpanded, setCoPilotExpanded] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (externalCommand) {
      runCommand(externalCommand);
      onExternalCommandConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCommand]);

  const formatPrompt = (state: VirtualMachineState) => {
    const shortCwd =
      state.cwd === `/home/${state.user}`
        ? "~"
        : state.cwd.replace(`/home/${state.user}/`, "~/");
    return `${state.user}@ubuntu:${shortCwd}$`;
  };

  const checkTasks = (cmdExecuted: string) => {
    const clean = cmdExecuted.trim();
    for (const t of tasks) {
      if (completedTaskIds.includes(t.id)) continue;
      try {
        const regex = new RegExp(t.validationRegex, "i");
        if (regex.test(clean)) {
          onTaskCompleted(t.id);
        }
      } catch (err) {
        console.warn("Regex check error:", err);
      }
    }
  };

  const runCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const promptPrefix = formatPrompt(vm);
    const nextState = { ...vm };
    const res = executeCommand(trimmed, nextState);
    setVm(nextState);

    if (res.clear) {
      setLines([]);
      return;
    }

    const newLines: TerminalLine[] = [
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        type: "prompt",
        promptPrefix,
        text: trimmed,
      },
    ];

    if (res.output) {
      newLines.push({
        id: `out-${Date.now()}-${Math.random()}`,
        type: "output",
        text: res.output,
      });
    }

    if (res.error) {
      newLines.push({
        id: `err-${Date.now()}-${Math.random()}`,
        type: "error",
        text: res.error,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
    checkTasks(trimmed);
    onCommandRun(trimmed, nextState.cwd);

    if (coPilotActive) {
      triggerCoPilot(trimmed, res.output, res.error, nextState.cwd);
    }
  };

  const triggerCoPilot = async (
    cmd: string,
    output?: string,
    error?: string,
    cwd?: string
  ) => {
    setCoPilotCard({
      command: cmd,
      explanation: "",
      loading: true,
    });
    setCoPilotExpanded(true);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: cmd,
          output,
          error,
          cwd,
          lessonTitle,
        }),
      });

      if (!res.ok) throw new Error("Co-pilot request failed");
      const data = await res.json();
      setCoPilotCard({
        command: cmd,
        explanation: data.explanation || "Command completed.",
        loading: false,
        source: data.source,
      });
    } catch {
      setCoPilotCard({
        command: cmd,
        explanation: `### ⚡ Command Executed: \`${cmd}\`\nCommand executed in directory \`${cwd || "~"}\`.`,
        loading: false,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!vm.history.length) return;
      const nextIdx = historyIdx === -1 ? vm.history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(vm.history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= vm.history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(vm.history[nextIdx] || "");
      }
    }
  };

  const handleResetVM = () => {
    setVm(createInitialVM());
    setLines([
      {
        id: `reset-${Date.now()}`,
        type: "system",
        text: "Sandbox state reset to clean Ubuntu snapshot.",
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col bg-[#050507] font-mono text-xs text-zinc-300 border-l border-zinc-800">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3 py-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-zinc-200">Terminal</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[11px] text-zinc-400">
            {vm.user}@ubuntu:{vm.cwd}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenAiTutor}
            className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            <Bot className="h-2.5 w-2.5" />
            AI Tutor
          </button>

          <button
            type="button"
            onClick={() => setCoPilotActive(!coPilotActive)}
            className={`flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition ${
              coPilotActive
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-500"
            }`}
          >
            <Sparkles className="h-2.5 w-2.5" />
            Co-pilot: {coPilotActive ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={handleResetVM}
            className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white transition"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Task strip */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-850 bg-black/50 px-3 py-1.5 text-[11px] no-scrollbar">
        <span className="text-zinc-500 font-sans text-[10px] uppercase font-semibold">
          Objectives:
        </span>
        {tasks.map((task) => {
          const isDone = completedTaskIds.includes(task.id);
          return (
            <div
              key={task.id}
              className={`flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-850 bg-zinc-950 text-zinc-400"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              ) : (
                <Circle className="h-3 w-3 text-zinc-600" />
              )}
              <span className="truncate max-w-[140px]">{task.title}</span>
              <span className="text-amber-400 font-bold">+{task.xp}XP</span>
            </div>
          );
        })}
      </div>

      {/* Scrollable Viewport */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-y-auto p-3 text-[12px] leading-relaxed cursor-text space-y-1.5"
      >
        {lines.map((l) => (
          <div key={l.id}>
            {l.type === "prompt" && (
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-emerald-400">
                  {l.promptPrefix}
                </span>
                <span className="text-zinc-100">{l.text}</span>
              </div>
            )}
            {l.type === "output" && (
              <pre className="whitespace-pre-wrap break-words text-zinc-300 font-mono">
                {l.text}
              </pre>
            )}
            {l.type === "error" && (
              <pre className="whitespace-pre-wrap break-words text-rose-400 font-mono">
                {l.text}
              </pre>
            )}
            {l.type === "system" && (
              <div className="text-zinc-500 italic"># {l.text}</div>
            )}
          </div>
        ))}

        {/* Input prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            runCommand(input);
            setInput("");
            setHistoryIdx(-1);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <span className="shrink-0 font-semibold text-emerald-400">
            {formatPrompt(vm)}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder="Type command..."
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-700 focus:outline-none"
          />
        </form>
        <div ref={bottomRef} />
      </div>

      {/* AI Co-pilot Bottom Inspector Drawer */}
      {coPilotActive && coPilotCard && (
        <div className="border-t border-zinc-800 bg-zinc-950/95 transition-all">
          <div className="flex items-center justify-between border-b border-zinc-850 px-3 py-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span className="font-semibold text-zinc-200">AI Co-pilot</span>
              <span className="text-zinc-600">•</span>
              <code className="text-zinc-400 truncate max-w-xs">{coPilotCard.command}</code>
              {coPilotCard.source && (
                <span className="rounded bg-zinc-900 border border-zinc-800 px-1 text-[9px] text-zinc-500">
                  {coPilotCard.source}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCoPilotExpanded(!coPilotExpanded)}
                className={`p-0.5 rounded transition-transform duration-200 ${
                  coPilotExpanded ? "rotate-0 text-cyan-400" : "-rotate-180 text-zinc-500 hover:text-zinc-300"
                }`}
                title={coPilotExpanded ? "Collapse" : "Expand"}
              >
                <ChevronDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setCoPilotCard(null)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div
            className={`grid transition-[grid-template-rows] duration-250 ease-out ${
              coPilotExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="max-h-48 overflow-y-auto p-3 text-[11px] leading-relaxed text-zinc-300 font-sans">
                {coPilotCard.loading ? (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <div className="h-3 w-3 animate-spin rounded-full border border-cyan-400 border-t-transparent" />
                    <span>Analyzing command structure & flags...</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {coPilotCard.explanation.split("\n\n").map((par, i) => {
                      if (par.startsWith("### ")) {
                        return (
                          <h4 key={i} className="font-semibold text-zinc-100 text-xs">
                            {par.replace("### ", "")}
                          </h4>
                        );
                      }
                      return (
                        <p key={i} className="text-zinc-400 text-xs leading-normal">
                          {par}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
