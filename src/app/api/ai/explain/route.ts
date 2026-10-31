import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface ExplainBody {
  command: string;
  output?: string;
  error?: string;
  cwd?: string;
  lessonTitle?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ExplainBody = await req.json();
    const { command, output, error, cwd = "~", lessonTitle = "Linux Lesson" } = body;

    if (!command || !command.trim()) {
      return NextResponse.json(
        { error: "No command provided to explain." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Use Gemini 3.8 Flash via official GoogleGenAI SDK if key is configured
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the AI Linux Co-pilot inside Linux Lounge.
Your role is to educate learners on Linux commands, syntax flags, and error troubleshooting.
Current lesson: "${lessonTitle}", Current directory: "${cwd}".
Format your response using GitHub-flavored markdown with:
1. **Summary**: 1 sentence summary of the command's purpose.
2. **Flag / Syntax Breakdown**: Clear bullet points explaining each flag or argument.
3. **Outcome / Error Diagnosis**: If an error occurred, explain why and give the exact fix.
4. **Pro Tip**: 1 best-practice or security tip for production Linux servers.
Keep the explanation crisp and under 150 words.`;

        const userPrompt = `Command executed:
\`\`\`bash
${command}
\`\`\`
${output ? `Output:\n\`\`\`\n${output}\n\`\`\`\n` : ""}${error ? `Error / Warning:\n\`\`\`\n${error}\n\`\`\`\n` : ""}`;

        const res = await ai.interactions.create({
          model: "gemini-3.8-flash",
          input: userPrompt,
          system_instruction: systemInstruction,
        });

        if (res.output_text) {
          return NextResponse.json({
            explanation: res.output_text,
            source: "gemini-3.8-flash",
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini Co-pilot error, using smart fallback:", geminiErr);
      }
    }

    // Smart heuristic fallback
    const explanation = generateHeuristicExplanation(command, output, error, cwd);
    return NextResponse.json({
      explanation,
      source: "linux-copilot-engine",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to explain command." },
      { status: 500 }
    );
  }
}

function generateHeuristicExplanation(
  cmdStr: string,
  output?: string,
  error?: string,
  cwd?: string
): string {
  const parts = cmdStr.trim().split(/\s+/);
  const base = parts[0];
  const args = parts.slice(1);

  if (error && error.includes("command not found")) {
    return `### 🔍 Command Not Found: \`${base}\`
- **Diagnosis**: The command \`${base}\` does not exist in your shell \`$PATH\` or is mistyped.
- **Fix**: Check spelling, or search for it using \`which ${base}\` or install with \`sudo apt install <package>\`.
- **Pro Tip**: In Bash, press \`Tab\` twice after typing a few letters to see available command completions.`;
  }

  if (error && error.includes("No such file or directory")) {
    return `### 📁 Path Not Found
- **Diagnosis**: The path specified in \`${cmdStr}\` does not exist relative to your current directory (\`${cwd}\`).
- **Fix**: Run \`pwd\` and \`ls\` to inspect existing directories before running the command.
- **Pro Tip**: Use \`cd -\` to quickly jump back to your previous working directory.`;
  }

  switch (base) {
    case "pwd":
      return `### 📍 \`pwd\` (Print Working Directory)
- **Summary**: Displays the absolute path of your current shell directory from the root \`/\`.
- **Breakdown**: No flags supplied; reads the current process \`PWD\` environment variable.
- **Pro Tip**: \`pwd -P\` resolves physical paths if navigating through symbolic links.`;

    case "ls":
      return `### 📂 \`ls\` (List Directory Contents)
- **Summary**: Lists files and subdirectories in the specified target.
- **Flags Breakdown**:
  * \`-l\`: Long listing format showing permissions, owner, group, file size, and timestamp.
  * \`-a\`: Includes hidden files (names beginning with a dot \`.\`).
- **Pro Tip**: Use \`ls -lh\` for human-readable file sizes (KB, MB, GB).`;

    case "cd":
      return `### 🧭 \`cd\` (Change Directory)
- **Summary**: Moves the active shell working directory to \`${args[0] || "~"}\`.
- **Flags Breakdown**: \`..\` moves up one level; \`~\` expands to \`/home/sysadmin\`.
- **Pro Tip**: Running bare \`cd\` without any arguments immediately returns to your home directory.`;

    case "chmod":
      return `### 🔒 \`chmod\` (Change Mode / Permissions)
- **Summary**: Sets file access permissions for Owner, Group, and Others.
- **Flags Breakdown**: \`${args.join(" ")}\` applies numeric octal mode bits (4=r, 2=w, 1=x).
- **Pro Tip**: Never use \`chmod 777\` in production; use \`chmod 600\` for private keys and \`chmod 755\` for executables.`;

    case "systemctl":
      return `### ⚙️ \`systemctl\` (Systemd Service Manager)
- **Summary**: Controls background daemons and service lifecycles on Linux.
- **Flags Breakdown**: Action is \`${args[0] || "status"}\` applied to unit \`${args[1] || "service"}\`.
- **Pro Tip**: Always verify daemon health with \`sudo systemctl status <unit>\` before and after configuration reloads.`;

    default:
      return `### ⚡ Command: \`${cmdStr}\`
- **Summary**: Executed binary \`${base}\` within directory \`${cwd}\`.
- **Status**: ${error ? `⚠️ Error: "${error}"` : "✅ Executed cleanly."}
- **Pro Tip**: Run \`man ${base}\` to read the official manual and see all supported flags.`;
  }
}
