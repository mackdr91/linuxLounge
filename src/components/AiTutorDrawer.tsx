"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  X,
  RefreshCw,
  Terminal as TerminalIcon,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { LabTask } from "@/types/lesson";

interface AiTutorDrawerProps {
  lessonTitle: string;
  cwd: string;
  recentCommands: string[];
  tasks: LabTask[];
  completedTaskIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onInjectCommand?: (command: string) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source?: string;
}

export default function AiTutorDrawer({
  lessonTitle,
  cwd,
  recentCommands,
  tasks,
  completedTaskIds,
  isOpen,
  onClose,
  onInjectCommand,
}: AiTutorDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `### 🐧 Linux Lounge AI Tutor
Hello! I am your AI pair programmer for **${lessonTitle}**.
Ask me any questions about concepts, commands, flags, or ask for a hint if you're stuck on a lab task!`,
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const activeTasks = tasks.map((t) => ({
        id: t.id,
        instruction: t.instruction,
        completed: completedTaskIds.includes(t.id),
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            lessonTitle,
            cwd,
            recentCommands,
            tasks: activeTasks,
          },
        }),
      });

      if (!res.ok) throw new Error("Tutor chat failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.message || "I could not generate a response right now.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: data.source,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Unable to connect to the AI tutor service. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="AI Linux Tutor Panel"
      className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-zinc-800 bg-black/95 shadow-2xl backdrop-blur-md sm:w-[420px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-100">AI Linux Tutor</span>
              <span className="inline-flex items-center gap-1 rounded bg-zinc-900 px-1.5 py-0.2 text-[9px] font-mono text-emerald-400 border border-zinc-800">
                <Sparkles className="h-2.5 w-2.5" /> Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate max-w-[240px]">
              {lessonTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          title="Close AI Tutor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* CWD and Task Status strip */}
      <div className="border-b border-zinc-850 bg-zinc-900/30 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-1.5 truncate">
          <TerminalIcon className="h-3 w-3 text-zinc-500" />
          <span className="truncate">CWD: <span className="text-emerald-400">{cwd}</span></span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span>{completedTaskIds.length}/{tasks.length} objectives</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[92%] rounded-lg px-3.5 py-2.5 ${
                m.role === "user"
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                  : "bg-zinc-950 border border-zinc-850 text-zinc-300"
              }`}
            >
              <div className="space-y-2 leading-relaxed font-sans">
                {m.content.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.startsWith("### ")) {
                    return (
                      <h4 key={idx} className="font-semibold text-zinc-100 text-xs">
                        {paragraph.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith("```")) {
                    const lines = paragraph.split("\n");
                    const code = lines.slice(1, -1).join("\n");
                    return (
                      <div key={idx} className="relative my-2 rounded border border-zinc-800 bg-black p-2 font-mono text-[11px] group">
                        <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{code}</pre>
                        {onInjectCommand && (
                          <button
                            onClick={() => onInjectCommand(code.trim())}
                            className="absolute top-1.5 right-1.5 rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            Run
                          </button>
                        )}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-zinc-300 text-xs leading-normal">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>{m.timestamp}</span>
                {m.source && <span className="text-zinc-600">{m.source}</span>}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400 w-fit">
            <RefreshCw className="h-3 w-3 animate-spin text-emerald-400" />
            <span>AI Tutor thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="border-t border-zinc-850 px-3 py-2 bg-zinc-950/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSendMessage("Give me a hint for the current task")}
          className="flex-shrink-0 inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
        >
          <Lightbulb className="h-3 w-3 text-amber-400" /> Task Hint
        </button>
        <button
          onClick={() => handleSendMessage("Explain what the last command I ran did")}
          className="flex-shrink-0 inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
        >
          <TerminalIcon className="h-3 w-3 text-cyan-400" /> Explain Last Command
        </button>
        <button
          onClick={() => handleSendMessage("What are the best practices for this lesson?")}
          className="flex-shrink-0 inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
        >
          <ShieldCheck className="h-3 w-3 text-emerald-400" /> Best Practices
        </button>
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t border-zinc-800 p-3 bg-black flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or request a hint..."
          disabled={loading}
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
          title="Send message"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </aside>
  );
}
