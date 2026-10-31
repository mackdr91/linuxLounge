export interface FileInode {
  name: string;
  type: "file" | "directory";
  permissions: string;
  owner: string;
  group: string;
  size: number;
  content?: string;
  children?: Record<string, FileInode>;
}

export interface VirtualMachineState {
  user: string;
  hostname: string;
  cwd: string;
  history: string[];
  root: FileInode;
  services: Record<
    string,
    { active: boolean; pid: number; enabled: boolean; description: string }
  >;
}

export interface ExecutionResult {
  output?: string;
  error?: string;
  clear?: boolean;
}

export function createInitialVM(): VirtualMachineState {
  const root: FileInode = {
    name: "/",
    type: "directory",
    permissions: "rwxr-xr-x",
    owner: "root",
    group: "root",
    size: 4096,
    children: {
      home: {
        name: "home",
        type: "directory",
        permissions: "rwxr-xr-x",
        owner: "root",
        group: "root",
        size: 4096,
        children: {
          sysadmin: {
            name: "sysadmin",
            type: "directory",
            permissions: "rwxr-xr-x",
            owner: "sysadmin",
            group: "sysadmin",
            size: 4096,
            children: {
              "notes.txt": {
                name: "notes.txt",
                type: "file",
                permissions: "rw-r--r--",
                owner: "sysadmin",
                group: "sysadmin",
                size: 142,
                content:
                  "Linux Lounge System Administration Notes:\n1. Check systemd service status using systemctl.\n2. Keep backups in /var/backups.\n3. Verify permissions before production deployments.\n",
              },
              ".bashrc": {
                name: ".bashrc",
                type: "file",
                permissions: "rw-r--r--",
                owner: "sysadmin",
                group: "sysadmin",
                size: 220,
                content: "# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PS1='\\u@\\h:\\w\\$ '\n",
              },
              "projects": {
                name: "projects",
                type: "directory",
                permissions: "rwxr-xr-x",
                owner: "sysadmin",
                group: "sysadmin",
                size: 4096,
                children: {
                  "web-app": {
                    name: "web-app",
                    type: "directory",
                    permissions: "rwxr-xr-x",
                    owner: "sysadmin",
                    group: "sysadmin",
                    size: 4096,
                    children: {
                      "server.js": {
                        name: "server.js",
                        type: "file",
                        permissions: "rw-r--r--",
                        owner: "sysadmin",
                        group: "sysadmin",
                        size: 320,
                        content: "const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.end('Linux Lounge Server OK');\n});\nserver.listen(8080);\n",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      etc: {
        name: "etc",
        type: "directory",
        permissions: "rwxr-xr-x",
        owner: "root",
        group: "root",
        size: 4096,
        children: {
          passwd: {
            name: "passwd",
            type: "file",
            permissions: "rw-r--r--",
            owner: "root",
            group: "root",
            size: 1024,
            content:
              "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsyslog:x:104:110::/home/syslog:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nsysadmin:x:1001:1001:System Administrator:/home/sysadmin:/bin/bash\n",
          },
          shadow: {
            name: "shadow",
            type: "file",
            permissions: "rw-r-----",
            owner: "root",
            group: "shadow",
            size: 512,
            content: "root:$6$rounds=4096$randomsalt$xyz:19000:0:99999:7:::\nsysadmin:$6$rounds=4096$passwordsalt$abc:19000:0:99999:7:::\n",
          },
          hostname: {
            name: "hostname",
            type: "file",
            permissions: "rw-r--r--",
            owner: "root",
            group: "root",
            size: 14,
            content: "ubuntu-server\n",
          },
          "os-release": {
            name: "os-release",
            type: "file",
            permissions: "rw-r--r--",
            owner: "root",
            group: "root",
            size: 256,
            content:
              'NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 24.04 LTS"\nVERSION_ID="24.04"\nHOME_URL="https://www.ubuntu.com/"\nSUPPORT_URL="https://help.ubuntu.com/"\nBUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"\nPRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"\nUBUNTU_CODENAME=noble\n',
          },
          nginx: {
            name: "nginx",
            type: "directory",
            permissions: "rwxr-xr-x",
            owner: "root",
            group: "root",
            size: 4096,
            children: {
              "nginx.conf": {
                name: "nginx.conf",
                type: "file",
                permissions: "rw-r--r--",
                owner: "root",
                group: "root",
                size: 640,
                content:
                  "user www-data;\nworker_processes auto;\npid /run/nginx.pid;\nerror_log /var/log/nginx/error.log;\n\nevents {\n    worker_connections 768;\n}\n\nhttp {\n    sendfile on;\n    keepalive_timeout 65;\n    include /etc/nginx/sites-enabled/*;\n}\n",
              },
            },
          },
        },
      },
      var: {
        name: "var",
        type: "directory",
        permissions: "rwxr-xr-x",
        owner: "root",
        group: "root",
        size: 4096,
        children: {
          log: {
            name: "log",
            type: "directory",
            permissions: "rwxr-xr-x",
            owner: "root",
            group: "root",
            size: 4096,
            children: {
              "syslog": {
                name: "syslog",
                type: "file",
                permissions: "rw-r-----",
                owner: "syslog",
                group: "adm",
                size: 2048,
                content: "Oct 31 04:00:01 ubuntu-server systemd[1]: Starting Daily apt download activities...\nOct 31 04:05:22 ubuntu-server kernel: [ 14.281] Linux version 5.15.0-89-generic\nOct 31 04:12:00 ubuntu-server systemd[1]: Started A high performance web server (nginx).\n",
              },
            },
          },
        },
      },
    },
  };

  return {
    user: "sysadmin",
    hostname: "ubuntu-server",
    cwd: "/home/sysadmin",
    history: [],
    root,
    services: {
      nginx: {
        active: true,
        pid: 1420,
        enabled: true,
        description: "A high performance web server and a reverse proxy server",
      },
      ssh: {
        active: true,
        pid: 620,
        enabled: true,
        description: "OpenBSD Secure Shell server",
      },
      cron: {
        active: true,
        pid: 742,
        enabled: true,
        description: "Regular background program processing daemon",
      },
    },
  };
}

export function getCompletions(partialPath: string, state: VirtualMachineState): string[] {
  const isAbsolute = partialPath.startsWith("/");
  const fullPath = isAbsolute
    ? partialPath
    : partialPath.startsWith("~")
    ? "/home/sysadmin" + partialPath.slice(1)
    : state.cwd + "/" + partialPath;

  const lastSlashIndex = fullPath.lastIndexOf("/");
  const dirPath = lastSlashIndex <= 0 ? "/" : fullPath.slice(0, lastSlashIndex);
  const prefix = fullPath.slice(lastSlashIndex + 1);

  const dirNode = getNodeAtPath(state.root, dirPath);
  if (!dirNode || !dirNode.children) return [];

  const candidates: string[] = [];
  for (const name of Object.keys(dirNode.children)) {
    if (name.startsWith(prefix)) {
      const child = dirNode.children[name];
      const suffix = child.type === "directory" ? "/" : "";
      if (isAbsolute) {
        const base = dirPath === "/" ? "" : dirPath;
        candidates.push(`${base}/${name}${suffix}`);
      } else if (partialPath.startsWith("~")) {
        candidates.push(`~/${name}${suffix}`);
      } else {
        const prefixDir = partialPath.includes("/")
          ? partialPath.slice(0, partialPath.lastIndexOf("/") + 1)
          : "";
        candidates.push(`${prefixDir}${name}${suffix}`);
      }
    }
  }
  return candidates;
}

export function executeCommand(
  rawCommand: string,
  state: VirtualMachineState
): ExecutionResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) return {};

  state.history.push(trimmed);

  // Handle pipe `|`
  if (trimmed.includes("|")) {
    const parts = trimmed.split("|").map((p) => p.trim());
    if (parts[1].startsWith("wc -l")) {
      const leftRes = executeCommand(parts[0], state);
      const lines = (leftRes.output || "").split("\n").filter((l) => l.trim()).length;
      return { output: `${lines}` };
    }
    if (parts[1].startsWith("grep")) {
      const grepArgs = parts[1].split(/\s+/).slice(1);
      const pattern = grepArgs[0] || "";
      const leftRes = executeCommand(parts[0], state);
      const matched = (leftRes.output || "")
        .split("\n")
        .filter((line) => line.includes(pattern))
        .join("\n");
      return { output: matched };
    }
  }

  // Handle file redirection `>` and `>>`
  if (trimmed.includes(">")) {
    const isAppend = trimmed.includes(">>");
    const [left, right] = isAppend ? trimmed.split(">>") : trimmed.split(">");
    const targetFile = right.trim();
    const leftRes = executeCommand(left.trim(), state);
    const content = leftRes.output || "";

    const cwdNode = getNodeAtPath(state.root, state.cwd);
    if (cwdNode && cwdNode.children) {
      if (cwdNode.children[targetFile] && isAppend) {
        cwdNode.children[targetFile].content =
          (cwdNode.children[targetFile].content || "") + content + "\n";
      } else {
        cwdNode.children[targetFile] = {
          name: targetFile,
          type: "file",
          permissions: "rw-r--r--",
          owner: state.user,
          group: state.user,
          size: content.length,
          content: content + "\n",
        };
      }
      return {};
    }
  }

  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0];
  const args = tokens.slice(1);

  switch (cmd) {
    case "pwd":
      return { output: state.cwd };

    case "clear":
      return { clear: true };

    case "whoami":
      return { output: state.user };

    case "hostname":
      return { output: state.hostname };

    case "uname":
      if (args.includes("-a")) {
        return {
          output: `Linux ${state.hostname} 5.15.0-89-generic #99-Ubuntu SMP Mon Oct 30 18:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux`,
        };
      }
      return { output: "Linux" };

    case "free":
      return {
        output:
          "               total        used        free      shared  buff/cache   available\nMem:         3924180     1148204     1825120       12044      950856     2512032\nSwap:        2097148           0     2097148",
      };

    case "ps":
      if (args.includes("aux")) {
        return {
          output:
            "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.2 168924 11204 ?        Ss   04:00   0:01 /sbin/init\nroot       620  0.0  0.1  15420  5400 ?        Ss   04:00   0:00 /usr/sbin/sshd -D\nsyslog     640  0.0  0.1 224108  4820 ?        Ssl  04:00   0:00 /usr/sbin/rsyslogd -n\nroot       742  0.0  0.0   8520  2800 ?        Ss   04:00   0:00 /usr/sbin/cron -f\nwww-data  1420  0.0  0.3  54800 12840 ?        S    04:12   0:00 nginx: worker process\nsysadmin  2140  0.0  0.1  12480  5100 pts/0    Ss   04:30   0:00 -bash\nsysadmin  2850  0.0  0.0  14200  3200 pts/0    R+   04:35   0:00 ps aux",
        };
      }
      return {
        output:
          "  PID TTY          TIME CMD\n 2140 pts/0    00:00:00 bash\n 2851 pts/0    00:00:00 ps",
      };

    case "ls": {
      const showAll = args.some((a) => a.includes("a"));
      const longFormat = args.some((a) => a.includes("l"));
      const pathArg = args.find((a) => !a.startsWith("-")) || "";
      const targetPath = resolvePath(state.cwd, pathArg);
      const targetNode = getNodeAtPath(state.root, targetPath);

      if (!targetNode) {
        return { error: `ls: cannot access '${pathArg}': No such file or directory` };
      }

      if (targetNode.type === "file") {
        return { output: targetNode.name };
      }

      const entries = Object.values(targetNode.children || {});
      const filtered = showAll ? entries : entries.filter((e) => !e.name.startsWith("."));

      if (longFormat) {
        const lines = filtered.map((e) => {
          const typeChar = e.type === "directory" ? "d" : "-";
          return `${typeChar}${e.permissions} 1 ${e.owner} ${e.group} ${String(e.size).padStart(6, " ")} Oct 31 04:00 ${e.name}`;
        });
        return { output: lines.join("\n") };
      }

      return { output: filtered.map((e) => e.name).join("  ") };
    }

    case "cd": {
      const targetPath = args[0] ? resolvePath(state.cwd, args[0]) : "/home/sysadmin";
      const targetNode = getNodeAtPath(state.root, targetPath);

      if (!targetNode) {
        return { error: `cd: ${args[0]}: No such file or directory` };
      }
      if (targetNode.type !== "directory") {
        return { error: `cd: ${args[0]}: Not a directory` };
      }

      state.cwd = targetPath;
      return {};
    }

    case "cat": {
      if (!args[0]) {
        return { error: "cat: missing operand" };
      }
      const targetPath = resolvePath(state.cwd, args[0]);
      const targetNode = getNodeAtPath(state.root, targetPath);

      if (!targetNode) {
        return { error: `cat: ${args[0]}: No such file or directory` };
      }
      if (targetNode.type === "directory") {
        return { error: `cat: ${args[0]}: Is a directory` };
      }

      // Check permission
      if (targetNode.permissions.startsWith("rw-r-----") && state.user !== "root" && state.user !== targetNode.owner) {
        return { error: `cat: ${args[0]}: Permission denied` };
      }

      return { output: targetNode.content || "" };
    }

    case "mkdir": {
      if (!args[0]) return { error: "mkdir: missing operand" };
      const dirName = args[0];
      const cwdNode = getNodeAtPath(state.root, state.cwd);
      if (!cwdNode || !cwdNode.children) {
        return { error: "mkdir: filesystem error" };
      }
      if (cwdNode.children[dirName]) {
        return { error: `mkdir: cannot create directory '${dirName}': File exists` };
      }

      cwdNode.children[dirName] = {
        name: dirName,
        type: "directory",
        permissions: "rwxr-xr-x",
        owner: state.user,
        group: state.user,
        size: 4096,
        children: {},
      };
      return {};
    }

    case "touch": {
      if (!args[0]) return { error: "touch: missing file operand" };
      const fileName = args[0];
      const cwdNode = getNodeAtPath(state.root, state.cwd);
      if (!cwdNode || !cwdNode.children) {
        return { error: "touch: filesystem error" };
      }

      if (!cwdNode.children[fileName]) {
        cwdNode.children[fileName] = {
          name: fileName,
          type: "file",
          permissions: "rw-r--r--",
          owner: state.user,
          group: state.user,
          size: 0,
          content: "",
        };
      }
      return {};
    }

    case "grep": {
      if (args.length < 2) return { error: "grep: search pattern and file operand required" };
      const pattern = args[0];
      const filePath = resolvePath(state.cwd, args[1]);
      const fileNode = getNodeAtPath(state.root, filePath);
      if (!fileNode) {
        return { error: `grep: ${args[1]}: No such file or directory` };
      }
      if (fileNode.type === "directory") {
        return { error: `grep: ${args[1]}: Is a directory` };
      }

      const lines = (fileNode.content || "").split("\n");
      const matched = lines.filter((l) => l.includes(pattern));
      return { output: matched.join("\n") };
    }

    case "chmod": {
      if (args.length < 2) return { error: "chmod: missing operand" };
      const mode = args[0];
      const filePath = resolvePath(state.cwd, args[1]);
      const fileNode = getNodeAtPath(state.root, filePath);
      if (!fileNode) return { error: `chmod: cannot access '${args[1]}': No such file or directory` };

      // Convert octal e.g. 755 or 600 to rwxr-xr-x
      if (/^[0-7]{3}$/.test(mode)) {
        const octalMap: Record<string, string> = {
          "7": "rwx",
          "6": "rw-",
          "5": "r-x",
          "4": "r--",
          "0": "---",
        };
        const p = mode
          .split("")
          .map((d) => octalMap[d] || "r--")
          .join("");
        fileNode.permissions = p;
        return {};
      }
      fileNode.permissions = mode;
      return {};
    }

    case "chown": {
      if (args.length < 2) return { error: "chown: missing operand" };
      const owner = args[0];
      const filePath = resolvePath(state.cwd, args[1]);
      const fileNode = getNodeAtPath(state.root, filePath);
      if (!fileNode) return { error: `chown: cannot access '${args[1]}': No such file or directory` };

      if (state.user !== "root") {
        return { error: `chown: changing ownership of '${args[1]}': Operation not permitted` };
      }
      fileNode.owner = owner;
      return {};
    }

    case "sudo": {
      if (!args.length) return { error: "sudo: a command is required" };
      const subState = { ...state, user: "root" };
      const subRes = executeCommand(args.join(" "), subState);
      return subRes;
    }

    case "systemctl": {
      if (args.length < 2) return { error: "systemctl: action and unit name required" };
      const action = args[0];
      const serviceName = args[1].replace(".service", "");

      const service = state.services[serviceName];
      if (!service) {
        return { error: `Unit ${serviceName}.service could not be found.` };
      }

      if (action === "status") {
        const statusText = service.active
          ? "● " + serviceName + ".service - " + service.description + "\n     Loaded: loaded (/lib/systemd/system/" + serviceName + ".service; enabled; vendor preset: enabled)\n     Active: active (running) since Fri 2026-10-31 04:00:00 UTC; 35min ago\n   Main PID: " + service.pid + " (" + serviceName + ")\n      Tasks: 2 (limit: 4642)\n     Memory: 14.8M\n        CPU: 182ms\n     CGroup: /system.slice/" + serviceName + ".service"
          : "○ " + serviceName + ".service - " + service.description + "\n     Loaded: loaded (/lib/systemd/system/" + serviceName + ".service; enabled; vendor preset: enabled)\n     Active: inactive (dead) since Fri 2026-10-31 04:30:00 UTC; 5min ago";
        return { output: statusText };
      }

      if (action === "restart") {
        service.active = true;
        service.pid = Math.floor(1000 + Math.random() * 4000);
        return { output: `[ OK ] Restarted ${serviceName}.service.` };
      }

      if (action === "stop") {
        service.active = false;
        return { output: `[ OK ] Stopped ${serviceName}.service.` };
      }

      if (action === "start") {
        service.active = true;
        service.pid = Math.floor(1000 + Math.random() * 4000);
        return { output: `[ OK ] Started ${serviceName}.service.` };
      }

      return { error: `Unknown systemctl command '${action}'` };
    }

    case "echo": {
      return { output: args.join(" ").replace(/^["']|["']$/g, "") };
    }

    case "help": {
      return {
        output:
          "Linux Lounge Shell Simulator v2.4 (Ubuntu 24.04 LTS)\nAvailable built-ins:\n  ls, cd, pwd, cat, mkdir, touch, grep, chmod, chown, sudo,\n  ps aux, free -h, systemctl status/restart, uname -a, clear, whoami, help\nSupports pipes (|) and output redirection (> and >>).",
      };
    }

    default:
      return {
        error: `${cmd}: command not found. Type 'help' to view supported built-ins.`,
      };
  }
}

function resolvePath(cwd: string, target: string): string {
  if (target === "~" || target === "") return "/home/sysadmin";
  if (target.startsWith("/")) return normalizePath(target);
  return normalizePath(cwd + "/" + target);
}

function normalizePath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return "/" + stack.join("/");
}

function getNodeAtPath(root: FileInode, path: string): FileInode | null {
  if (path === "/" || path === "") return root;
  const parts = path.split("/").filter(Boolean);
  let curr: FileInode = root;

  for (const part of parts) {
    if (!curr.children || !curr.children[part]) {
      return null;
    }
    curr = curr.children[part];
  }
  return curr;
}
