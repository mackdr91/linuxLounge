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

type WorkspaceTab = "lesson" | "tasks" | "cheatsheet";

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
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [currentCwd, setCurrentCwd] = useState("/home/sysadmin");
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [xpToast, setXpToast] = useState<{ message: string; xp: number } | null>(null);

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
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="flex h-screen flex-col bg-black text-zinc-100 font-sans overflow-hidden">
      {/* Top HUD */}
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Lessons</span>
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-xs font-semibold text-zinc-200">
            Lesson 0{lesson.number}: {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-mono text-amber-400">
            <Zap className="h-3 w-3 fill-amber-400" />
            <span>
              {completedTaskIds.length}/{lesson.tasks.length} Done
            </span>
          </div>

          <button
            onClick={() => setIsAiTutorOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANE: Theory, Labs, Cheat Sheet */}
        <div className="flex flex-1 flex-col border-r border-zinc-850 overflow-hidden bg-black">
          {/* Tabs */}
          <div className="flex h-9 items-center border-b border-zinc-850 bg-zinc-950 px-2">
            <button
              onClick={() => setActiveTab("lesson")}
              className={`flex items-center gap-1.5 border-b-2 px-3 h-full text-xs font-medium transition ${
                activeTab === "lesson"
                  ? "border-emerald-500 text-zinc-100 bg-zinc-900/50"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <BookOpen className="h-3 w-3" />
              Lesson
            </button>

            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex items-center gap-1.5 border-b-2 px-3 h-full text-xs font-medium transition ${
                activeTab === "tasks"
                  ? "border-emerald-500 text-zinc-100 bg-zinc-900/50"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              Objectives ({completedTaskIds.length}/{lesson.tasks.length})
            </button>

            <button
              onClick={() => setActiveTab("cheatsheet")}
              className={`flex items-center gap-1.5 border-b-2 px-3 h-full text-xs font-medium transition ${
                activeTab === "cheatsheet"
                  ? "border-emerald-500 text-zinc-100 bg-zinc-900/50"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileText className="h-3 w-3" />
              Cheat Sheet
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
                  <h1 className="mt-1 text-xl font-bold text-white">
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
                      className="rounded-lg border border-zinc-850 bg-zinc-950 p-4 space-y-3"
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
                          className="rounded border border-zinc-800 bg-black p-2.5 font-mono text-xs"
                        >
                          <div className="mb-1 text-[10px] text-zinc-500 font-sans">
                            {snip.label}
                          </div>
                          <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                            {snip.command}
                          </pre>
                          <div className="mt-2 flex items-center justify-end gap-1.5 font-sans">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(snip.command)}
                              className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white"
                            >
                              {copiedCmd === snip.command ? "Copied" : "Copy"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setExternalCommand(snip.command)}
                              className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-0.5 text-[10px] text-white hover:bg-emerald-500 font-medium"
                            >
                              <Play className="h-2.5 w-2.5" />
                              Run in Terminal
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Next / Prev Navigation */}
                <div className="flex items-center justify-between border-t border-zinc-850 pt-4 text-xs font-mono">
                  {prevLesson ? (
                    <Link
                      href={`/learn/${prevLesson.slug}`}
                      className="flex items-center gap-1 text-zinc-400 hover:text-white"
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
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <span>Lesson 0{nextLesson.number}: {nextLesson.title}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="max-w-2xl space-y-3">
                <h2 className="text-sm font-semibold text-zinc-100">
                  Interactive Lab Objectives
                </h2>
                <p className="text-xs text-zinc-400">
                  Execute these tasks in the integrated terminal. The validator detects commands in real time.
                </p>

                <div className="space-y-2 pt-2">
                  {lesson.tasks.map((task, idx) => {
                    const isDone = completedTaskIds.includes(task.id);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-lg border p-3 text-xs transition ${
                          isDone
                            ? "border-emerald-500/30 bg-emerald-500/5 text-zinc-200"
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
                          <span className="font-mono text-[11px] text-amber-400 font-bold">
                            +{task.xp} XP
                          </span>
                        </div>

                        <p className="mt-1 text-zinc-400">{task.instruction}</p>

                        {task.hint && (
                          <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                            <span className="text-zinc-400 font-sans">Hint:</span> {task.hint}
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
                      className="rounded-lg border border-zinc-850 bg-zinc-950 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-emerald-400 font-semibold">
                          {item.command} {item.flags !== "-" && item.flags}
                        </code>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.command)}
                            className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => setExternalCommand(item.command)}
                            className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] text-white hover:bg-emerald-500"
                          >
                            Run
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-zinc-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Integrated Terminal Simulator */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#050507]">
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
        onClose={() => setIsAiTutorOpen(false)}
        onInjectCommand={(cmd) => setExternalCommand(cmd)}
      />

      {/* XP Toast Notification */}
      {xpToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 shadow-2xl">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{xpToast.message}</span>
          <span className="font-mono font-bold text-amber-400">+{xpToast.xp} XP</span>
        </div>
      )}
    </div>
  );
}
