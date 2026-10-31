import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatBody {
  messages: ChatMessage[];
  context: {
    lessonTitle?: string;
    cwd?: string;
    recentCommands?: string[];
    tasks?: { id: string; instruction: string; completed: boolean }[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatBody = await req.json();
    const { messages = [], context = {} } = body;

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || "";
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the AI Linux Tutor inside Linux Lounge.
You are helping a learner working on lesson: "${context.lessonTitle || "Linux Fundamentals"}".
- Current working directory: \`${context.cwd || "/home/sysadmin"}\`
- Recent terminal commands: ${context.recentCommands?.length ? context.recentCommands.slice(-4).map(c => `\`${c}\``).join(", ") : "none yet"}
- Active tasks:
${(context.tasks || []).map(t => `  * [${t.completed ? "x" : " "}] ${t.instruction}`).join("\n") || "  (None)"}

Guidelines:
1. Provide encouraging, step-by-step guidance.
2. Teach the reasoning behind commands, not just the command syntax.
3. If they are stuck on a task, provide a progressive hint first rather than immediately spoiling the answer.
4. Format output cleanly in GitHub-flavored markdown with code in \`\`\`bash\`\`\` blocks.`;

        const conversationPrompt = messages
          .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
          .join("\n\n");

        const res = await ai.interactions.create({
          model: "gemini-3.8-flash",
          input: conversationPrompt,
          system_instruction: systemInstruction,
        });

        if (res.output_text) {
          return NextResponse.json({
            message: res.output_text,
            source: "gemini-3.8-flash",
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini Chat error, using fallback:", geminiErr);
      }
    }

    // Heuristic tutor response
    const reply = generateHeuristicTutorReply(lastMessage, context);
    return NextResponse.json({
      message: reply,
      source: "linux-tutor-engine",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate tutor reply." },
      { status: 500 }
    );
  }
}

function generateHeuristicTutorReply(
  userQuery: string,
  context: ChatBody["context"]
): string {
  const q = userQuery.toLowerCase();

  if (q.includes("hint") || q.includes("help") || q.includes("stuck") || q.includes("task")) {
    const nextTask = context.tasks?.find((t) => !t.completed);
    if (nextTask) {
      return `### 💡 Task Hint
You are currently working on:
> **${nextTask.instruction}**

Key pointers to guide you:
1. Check your current directory (\`${context.cwd || "~"}\`).
2. Make sure you are using the right command and flags.
3. You can click **"Run in Terminal"** on any code snippet in the lesson pane to test it out!`;
    }
  }

  if (q.includes("permission") || q.includes("chmod") || q.includes("chown")) {
    return `### 🛡️ Linux Permission System
Permissions in Linux represent three octal bits:
- **Read (r)** = 4
- **Write (w)** = 2
- **Execute (x)** = 1

For example, \`chmod 755 script.sh\` gives the Owner full control (\`4+2+1 = 7\`), and Group and Others read & execute (\`4+1 = 5\`).
For private files, \`chmod 600 key.pem\` allows only the Owner to read and write!`;
  }

  if (q.includes("systemctl") || q.includes("service") || q.includes("nginx")) {
    return `### ⚙️ Managing Daemons with Systemd
- **Status**: \`sudo systemctl status <service>\`
- **Start / Stop**: \`sudo systemctl start <service>\` / \`sudo systemctl stop <service>\`
- **Restart**: \`sudo systemctl restart <service>\`
- **Logs**: \`sudo journalctl -u <service> -f\``;
  }

  return `### 🐧 Greetings from your Linux Lounge Tutor!
I am monitoring your workspace in **${context.lessonTitle || "Linux Lounge"}**.
- Working Directory: \`${context.cwd || "~"}\`
- Status: Ready to assist.

Ask me anything about flags, error messages, or how Linux handles permissions, pipes, and processes!`;
}
