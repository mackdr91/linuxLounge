"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Terminal,
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  Play,
  Copy,
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  Zap,
} from "lucide-react";
import { LESSONS } from "@/data/lessons";
import TerminalEmulator from "@/components/TerminalEmulator";
import AiTutorDrawer from "@/components/AiTutorDrawer";
import { soundEffects } from "@/lib/soundEffects";

type WorkspaceTab = "lesson" | "tasks" | "cheatsheet";
type MobileViewMode = "guide" | "terminal" | "ai";

export default function LessonWorkspacePage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const slug = params?.lessonId || "the-shell-awakening";

  const lesson = LESSONS.find((l) => l.slug === slug) || LESSONS[0];
  const currentIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("lesson");
  const [mobileMode, setMobileMode] = useState<MobileViewMode>("guide");
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [currentCwd, setCurrentCwd] = useState("/home/sysadmin");
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [xpToast, setXpToast] = useState<{ message: string; xp: number } | null>(null);
  const [beamTarget, setBeamTarget] = useState(false);

  // Load completed tasks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`tasks_${lesson.id}`);
      if (stored) {
        setCompletedTaskIds(JSON.parse(stored));
      } else {
        setCompletedTaskIds([]);
      }
    } catch {}
  }, [lesson.id]);

  const handleTaskCompleted = (taskId: string) => {
    if (completedTaskIds.includes(taskId)) return;
    const task = lesson.tasks.find((t) => t.id === taskId);
    const updated = [...completedTaskIds, taskId];
    setCompletedTaskIds(updated);
    soundEffects.playTaskSuccess();

    try {
      localStorage.setItem(`tasks_${lesson.id}`, JSON.stringify(updated));

      // Check if all tasks in lesson are finished
      if (updated.length === lesson.tasks.length) {
        const storedLessons = localStorage.getItem("linux_lounge_completed_lessons");
        const list = storedLessons ? JSON.parse(storedLessons) : [];
        if (!list.includes(lesson.id)) {
          localStorage.setItem(
            "linux_lounge_completed_lessons",
            JSON.stringify([...list, lesson.id])
          );
        }
      }
    } catch {}

    if (task) {
      setXpToast({
        message: `Task Completed: ${task.title}`,
        xp: task.xp,
      });
      setTimeout(() => setXpToast(null), 3500);
    }
  };

  const copyToClipboard = (cmd: string) => {
    soundEffects.playKeyClick();
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleRunInTerminal = (cmd: string) => {
    soundEffects.playKeyClick();
    setExternalCommand(cmd);
    setBeamTarget(true);
    setTimeout(() => setBeamTarget(false), 800);
    // Switch to terminal on mobile viewport
    setMobileMode("terminal");
  };

  return (
    <div className="flex h-screen flex-col bg-black text-zinc-100 font-sans overflow-hidden">
      {/* Top HUD */}
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 shadow-machined z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">All Lessons</span>
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-xs font-semibold text-zinc-200 truncate max-w-[200px] sm:max-w-none">
            Lesson 0{lesson.number}: {lesson.title}
          </span>
        </div>

        {/* Mobile Viewport Segmented Control (<1024px) */}
        <div className="flex lg:hidden items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setMobileMode("guide")}
            className={`px-2.5 py-1 rounded transition ${
              mobileMode === "guide" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400"
            }`}
          >
            Guide
          </button>
          <button
            onClick={() => setMobileMode("terminal")}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              mobileMode === "terminal" ? "bg-emerald-600 text-white font-semibold" : "text-zinc-400"
            }`}
          >
            <span>Terminal</span>
            <span className="text-[10px] text-zinc-200">
              ({completedTaskIds.length}/{lesson.tasks.length})
            </span>
          </button>
          <button
            onClick={() => {
              setMobileMode("ai");
              setIsAiTutorOpen(true);
            }}
            className={`px-2.5 py-1 rounded transition ${
              mobileMode === "ai" ? "bg-cyan-600 text-white font-semibold" : "text-zinc-400"
            }`}
          >
            Ask AI
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-2.5">
          <div className="flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-mono text-amber-400 shadow-machined">
            <Zap className="h-3 w-3 fill-amber-400" />
            <span className="tabular-nums">
              {completedTaskIds.length}/{lesson.tasks.length} Done
            </span>
          </div>

          <button
            onClick={() => setIsAiTutorOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-900/40 transition shadow-machined"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Workspace */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT PANE: Theory, Labs, Cheat Sheet (42% width on desktop) */}
        <div
          className={`flex flex-col border-r border-zinc-850 overflow-hidden bg-black lg:w-[42%] w-full h-full ${
            mobileMode === "guide" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Tabs */}
          <div className="flex h-10 items-center border-b border-zinc-850 bg-zinc-950 px-2">
            <button
              onClick={() => setActiveTab("lesson")}
              className={`flex items-center gap-1.5 border-b-2 px-3.5 h-full text-xs font-medium transition ${
                activeTab === "lesson"
                  ? "border-emerald-500 text-zinc-100 bg-zinc-900/60"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Lesson</span>
            </button>

            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex items-center gap-1.5 border-b-2 px-3.5 h-full text-xs font-medium transition ${
                activeTab === "tasks"
                  ? "border-emerald-500 text-zinc-100 bg-zinc-900/60"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                Objectives ({completedTaskIds.length}/{lesson.tasks.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("cheatsheet")}
              className={`flex items-center gap-1.5 border-b-2 px-3.5 h-full text-xs font-medium transition ${
                activeTab === "cheatsheet"
                  ? "border-emerald-500 text-zinc-100 bg-zinc-900/60"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Cheat Sheet</span>
            </button>
          </div>

          {/* Scrollable Tab Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm">
            {activeTab === "lesson" && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <div className="text-xs font-mono text-zinc-500">
                    Lesson 0{lesson.number} • {lesson.estimatedMinutes} min read
                  </div>
                  <h1 className="mt-1 text-xl font-bold text-white tracking-tight">
                    {lesson.title}
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {lesson.overview}
                  </p>
                </div>

                {/* Sections */}
                <div className="space-y-5">
                  {lesson.sections.map((sec, i) => (
                    <div
                      key={sec.id}
                      className="rounded-lg border border-zinc-850 bg-zinc-950 p-4 space-y-3 shadow-machined"
                    >
                      <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                        <span className="font-mono text-emerald-400 text-xs">
                          0{i + 1}.
                        </span>
                        {sec.title}
                      </h2>

                      <p className="text-xs leading-relaxed text-zinc-400">
                        {sec.body}
                      </p>

                      {sec.codeSnippets?.map((snip, snipIdx) => (
                        <div
                          key={snipIdx}
                          className="rounded border border-zinc-800 bg-[#050507] p-3 font-mono text-xs shadow-machined"
                        >
                          <div className="mb-1 text-[10px] text-zinc-500 font-sans">
                            {snip.label}
                          </div>
                          <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                            {snip.command}
                          </pre>
                          <div className="mt-2 flex items-center justify-end gap-2 font-sans">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(snip.command)}
                              className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white transition"
                            >
                              {copiedCmd === snip.command ? "Copied" : "Copy"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRunInTerminal(snip.command)}
                              className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-0.5 text-[10px] text-white hover:bg-emerald-500 font-medium transition shadow-bevel-glow"
                            >
                              <Play className="h-2.5 w-2.5" />
                              <span>Run in Terminal</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Next / Prev Navigation */}
                <div className="flex items-center justify-between border-t border-zinc-850 pt-5 text-xs font-mono">
                  {prevLesson ? (
                    <Link
                      href={`/learn/${prevLesson.slug}`}
                      className="flex items-center gap-1 text-zinc-400 hover:text-white transition"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Lesson 0{prevLesson.number}</span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextLesson && (
                    <Link
                      href={`/learn/${nextLesson.slug}`}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                    >
                      <span>Lesson 0{nextLesson.number}: {nextLesson.title}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="max-w-2xl space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-100">
                    Interactive Lab Objectives
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Execute these tasks in the integrated terminal. The validator inspects commands and files in real time.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {lesson.tasks.map((task) => {
                    const isDone = completedTaskIds.includes(task.id);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-lg border p-3.5 text-xs transition shadow-machined ${
                          isDone
                            ? "border-emerald-500/40 bg-emerald-950/20 text-zinc-200"
                            : "border-zinc-850 bg-zinc-950 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Circle className="h-4 w-4 text-zinc-600" />
                            )}
                            <span className="font-semibold text-zinc-200">
                              {task.title}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-amber-400 font-bold tabular-nums">
                            +{task.xp} XP
                          </span>
                        </div>

                        <p className="mt-1.5 text-zinc-400 leading-relaxed">{task.instruction}</p>

                        {task.hint && (
                          <div className="mt-2 text-[11px] text-zinc-500 font-mono bg-zinc-900/60 p-2 rounded border border-zinc-850">
                            <span className="text-cyan-400 font-sans font-medium">Hint:</span> {task.hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "cheatsheet" && (
              <div className="max-w-2xl space-y-3">
                <h2 className="text-sm font-semibold text-zinc-100">
                  Command Cheat Sheet
                </h2>
                <div className="space-y-2">
                  {lesson.cheatSheet.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-zinc-850 bg-zinc-950 p-3 text-xs shadow-machined"
                    >
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-emerald-400 font-semibold">
                          {item.command} {item.flags !== "-" && item.flags}
                        </code>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.command)}
                            className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white transition"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRunInTerminal(item.command)}
                            className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] text-white hover:bg-emerald-500 transition"
                          >
                            Run
                          </button>
                        </div>
                      </div>
                      <p className="mt-1.5 text-zinc-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Integrated Terminal Simulator (58% width on desktop) */}
        <div
          className={`flex flex-col overflow-hidden bg-[#050507] lg:w-[58%] w-full h-full relative ${
            beamTarget ? "ring-2 ring-cyan-500/50" : ""
          } ${mobileMode === "terminal" ? "flex" : "hidden lg:flex"}`}
        >
          <TerminalEmulator
            lessonTitle={lesson.title}
            tasks={lesson.tasks}
            completedTaskIds={completedTaskIds}
            externalCommand={externalCommand}
            onExternalCommandConsumed={() => setExternalCommand(null)}
            onTaskCompleted={handleTaskCompleted}
            onOpenAiTutor={() => setIsAiTutorOpen(true)}
            onCommandRun={(cmd, cwd) => {
              setCurrentCwd(cwd);
              setRecentCommands((prev) => [...prev.slice(-8), cmd]);
            }}
          />
        </div>
      </div>

      {/* AI Tutor Drawer */}
      <AiTutorDrawer
        lessonTitle={`Lesson 0${lesson.number}: ${lesson.title}`}
        cwd={currentCwd}
        recentCommands={recentCommands}
        tasks={lesson.tasks}
        completedTaskIds={completedTaskIds}
        isOpen={isAiTutorOpen}
        onClose={() => {
          setIsAiTutorOpen(false);
          if (mobileMode === "ai") setMobileMode("guide");
        }}
        onInjectCommand={(cmd) => handleRunInTerminal(cmd)}
      />

      {/* XP Toast Notification */}
      {xpToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 shadow-bevel-glow animate-bounce">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{xpToast.message}</span>
          <span className="font-mono font-bold text-amber-400 tabular-nums">+{xpToast.xp} XP</span>
        </div>
      )}
    </div>
  );
}
