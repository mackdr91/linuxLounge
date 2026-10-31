"use client";

import React, { useEffect, useState } from "react";

const terminalLines = [
  "sysadmin@ubuntu-server:~$ uname -a",
  "Linux ubuntu-server 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux",
  "sysadmin@ubuntu-server:~$ sudo systemctl status nginx",
  "● nginx.service - A high performance web server and a reverse proxy server",
  "     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)",
  "     Active: active (running) since Sat 2026-10-31 04:12:00 UTC; 4min ago",
  "   Main PID: 1420 (nginx)",
  "sysadmin@ubuntu-server:~$ ip -c -br a",
  "lo               UNKNOWN        127.0.0.1/8 ::1/128 ",
  "eth0             UP             192.168.1.100/24 fe80::215:5dff:fe34:5678/64 ",
  "sysadmin@ubuntu-server:~$ docker ps",
  "CONTAINER ID   IMAGE                 COMMAND                  STATUS          PORTS",
  "7a8b9c0d1e2f   redis:7-alpine        \"docker-entrypoint.s…\"   Up 12 minutes   0.0.0.0:6379->6379/tcp",
  "9f8e7d6c5b4a   postgres:16-alpine    \"docker-entrypoint.s…\"   Up 12 minutes   0.0.0.0:5432->5432/tcp",
  "sysadmin@ubuntu-server:~$ cat /etc/netplan/00-installer-config.yaml",
  "network:",
  "  version: 2",
  "  renderer: networkd",
  "  ethernets:",
  "    eth0:",
  "      dhcp4: true",
  "sysadmin@ubuntu-server:~$ df -h /",
  "Filesystem      Size  Used Avail Use% Mounted on",
  "/dev/nvme0n1p2   50G   14G   34G  30% /",
  "sysadmin@ubuntu-server:~$ gemini-agent --query \"explain memory cache ratio\"",
  "AI Analysis: Virtual memory is balanced. Page cache is utilizing 3.4GB safely.",
];

export default function TerminalTypingCanvas() {
  const [renderedLines, setRenderedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) {
      const resetTimeout = setTimeout(() => {
        setRenderedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 4000);
      return () => clearTimeout(resetTimeout);
    }

    const targetLine = terminalLines[currentLineIndex];

    if (currentCharIndex < targetLine.length) {
      // Faster typing for outputs, natural typing for prompt lines
      const isPrompt = targetLine.startsWith("sysadmin@");
      const speed = isPrompt ? Math.floor(Math.random() * 25) + 15 : 6;

      const timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Completed line, push to rendered and advance
      const nextLineTimeout = setTimeout(() => {
        setRenderedLines((prev) => [...prev, targetLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 250);
      return () => clearTimeout(nextLineTimeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  const activeTypingText =
    currentLineIndex < terminalLines.length
      ? terminalLines[currentLineIndex].substring(0, currentCharIndex)
      : "";

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 select-none overflow-hidden font-mono text-[13px] leading-relaxed text-emerald-400/90 pointer-events-none p-6 sm:p-12 md:p-16 flex flex-col justify-end"
    >
      <div className="space-y-1 max-w-4xl opacity-80 filter blur-[0.3px]">
        {renderedLines.slice(-14).map((line, idx) => {
          const isPrompt = line.startsWith("sysadmin@");
          const isAi = line.startsWith("AI Analysis:");
          return (
            <div
              key={idx}
              className={`truncate ${
                isPrompt
                  ? "text-emerald-300 font-semibold"
                  : isAi
                  ? "text-cyan-300 font-medium"
                  : "text-zinc-400"
              }`}
            >
              {line}
            </div>
          );
        })}

        {activeTypingText && (
          <div className="flex items-center text-emerald-300 font-semibold truncate">
            <span>{activeTypingText}</span>
            <span className="inline-block h-4 w-2 bg-emerald-400 ml-1 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
