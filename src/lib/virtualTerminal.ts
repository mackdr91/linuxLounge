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
              ".bashrc": {
                name: ".bashrc",
                type: "file",
                permissions: "rw-r--r--",
                owner: "sysadmin",
                group: "sysadmin",
                size: 220,
                content: "# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PS1='\\u@\\h:\\w\\$ '\nalias ll='ls -la'\n",
              },
              ".profile": {
                name: ".profile",
                type: "file",
                permissions: "rw-r--r--",
                owner: "sysadmin",
                group: "sysadmin",
                size: 807,
                content: "# ~/.profile: executed by the command interpreter for login shells.\n",
              },
              "id_rsa": {
                name: "id_rsa",
                type: "file",
                permissions: "rw-r--r--",
                owner: "sysadmin",
                group: "sysadmin",
                size: 1675,
                content: "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\n-----END OPENSSH PRIVATE KEY-----\n",
              },
              "notes.txt": {
                name: "notes.txt",
                type: "file",
                permissions: "rw-r--r--",
                owner: "sysadmin",
                group: "sysadmin",
                size: 64,
                content: "Welcome to Linux Lounge!\nPractice commands and check task objectives.\n",
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
          "os-release": {
            name: "os-release",
            type: "file",
            permissions: "rw-r--r--",
            owner: "root",
            group: "root",
            size: 180,
            content: "NAME=\"Ubuntu\"\nVERSION=\"24.04.1 LTS (Noble Numbat)\"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME=\"Ubuntu 24.04.1 LTS\"\nVERSION_ID=\"24.04\"\nHOME_URL=\"https://www.ubuntu.com/\"\n",
          },
          passwd: {
            name: "passwd",
            type: "file",
            permissions: "rw-r--r--",
            owner: "root",
            group: "root",
            size: 940,
            content: "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nsysadmin:x:1000:1000:SysAdmin,,,:/home/sysadmin:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nnginx:x:101:101:nginx user:/nonexistent:/bin/false\n",
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
        pid: 710,
        enabled: true,
        description: "Regular background program processing daemon",
      },
    },
  };
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
      const grepArg = parts[1].replace(/^grep\s+/, "").replace(/['"]/g, "").trim();
      const leftRes = executeCommand(parts[0], state);
      const matched = (leftRes.output || "")
        .split("\n")
        .filter((line) => line.toLowerCase().includes(grepArg.toLowerCase()))
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

    case "uptime":
      return {
        output: " 04:20:15 up 42 min,  1 user,  load average: 0.08, 0.04, 0.01",
      };

    case "uname":
      if (args.includes("-a")) {
        return {
          output: "Linux ubuntu-server 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux",
        };
      }
      return { output: "Linux" };

    case "history":
      return {
        output: state.history
          .map((h, i) => `  ${(i + 1).toString().padStart(3, " ")}  ${h}`)
          .join("\n"),
      };

    case "ls": {
      const showAll = args.some((a) => a.includes("a"));
      const showLong = args.some((a) => a.includes("l"));
      const pathArg = args.find((a) => !a.startsWith("-")) || state.cwd;
      const target = resolvePath(state.cwd, pathArg);
      const node = getNodeAtPath(state.root, target);

      if (!node) {
        return { error: `ls: cannot access '${pathArg}': No such file or directory` };
      }

      if (node.type === "file") {
        return { output: node.name };
      }

      const items = Object.values(node.children || {});
      const filtered = showAll ? items : items.filter((i) => !i.name.startsWith("."));

      if (showLong) {
        const lines = filtered.map(
          (i) =>
            `${i.type === "directory" ? "d" : "-"}${i.permissions} 1 ${i.owner} ${i.group} ${i.size.toString().padStart(5, " ")} Oct 31 04:00 ${i.name}`
        );
        return { output: `total ${filtered.length * 4}\n` + lines.join("\n") };
      }

      return { output: filtered.map((i) => i.name).join("  ") };
    }

    case "cd": {
      const dest = args[0] || "/home/" + state.user;
      let targetPath = dest === "~" ? "/home/" + state.user : resolvePath(state.cwd, dest);
      const node = getNodeAtPath(state.root, targetPath);

      if (!node) {
        return { error: `bash: cd: ${dest}: No such file or directory` };
      }
      if (node.type !== "directory") {
        return { error: `bash: cd: ${dest}: Not a directory` };
      }

      state.cwd = targetPath;
      return {};
    }

    case "mkdir": {
      const name = args.filter((a) => !a.startsWith("-"))[0];
      if (!name) return { error: "mkdir: missing operand" };

      const parentNode = getNodeAtPath(state.root, state.cwd);
      if (parentNode && parentNode.children) {
        parentNode.children[name] = {
          name,
          type: "directory",
          permissions: "rwxr-xr-x",
          owner: state.user,
          group: state.user,
          size: 4096,
          children: {},
        };
      }
      return {};
    }

    case "touch": {
      const name = args[0];
      if (!name) return { error: "touch: missing file operand" };

      const parentNode = getNodeAtPath(state.root, state.cwd);
      if (parentNode && parentNode.children) {
        if (!parentNode.children[name]) {
          parentNode.children[name] = {
            name,
            type: "file",
            permissions: "rw-r--r--",
            owner: state.user,
            group: state.user,
            size: 0,
            content: "",
          };
        }
      }
      return {};
    }

    case "cat": {
      const targetPath = args[0];
      if (!targetPath) return { error: "cat: missing file operand" };

      const fullPath = resolvePath(state.cwd, targetPath);
      const node = getNodeAtPath(state.root, fullPath);

      if (!node) {
        return { error: `cat: ${targetPath}: No such file or directory` };
      }
      if (node.type === "directory") {
        return { error: `cat: ${targetPath}: Is a directory` };
      }
      return { output: node.content || "" };
    }

    case "echo": {
      const text = args.join(" ").replace(/^['"]|['"]$/g, "");
      return { output: text };
    }

    case "chmod": {
      const mode = args[0];
      const filename = args[1];
      if (!mode || !filename) {
        return { error: "chmod: missing operand" };
      }
      const fullPath = resolvePath(state.cwd, filename);
      const node = getNodeAtPath(state.root, fullPath);
      if (!node) {
        return { error: `chmod: cannot access '${filename}': No such file or directory` };
      }

      if (mode === "600") node.permissions = "rw-------";
      else if (mode === "755" || mode === "+x") node.permissions = "rwxr-xr-x";
      else if (mode === "644") node.permissions = "rw-r--r--";
      return {};
    }

    case "grep": {
      const pattern = args[0]?.replace(/['"]/g, "");
      const filename = args[1];
      if (!pattern) return { error: "grep: missing pattern" };
      if (!filename) return { error: "grep: missing file operand" };

      const fullPath = resolvePath(state.cwd, filename);
      const node = getNodeAtPath(state.root, fullPath);
      if (!node) {
        return { error: `grep: ${filename}: No such file or directory` };
      }

      const lines = (node.content || "").split("\n");
      const matched = lines.filter((l) =>
        l.toLowerCase().includes(pattern.toLowerCase())
      );
      return { output: matched.join("\n") };
    }

    case "ps": {
      return {
        output: `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.2 168232 11844 ?        Ss   04:00   0:01 /sbin/init
sysadmin     620  0.0  0.1  14856  4120 ?        Ss   04:00   0:00 /usr/sbin/sshd -D
root         710  0.0  0.0   8564  2100 ?        Ss   04:00   0:00 /usr/sbin/cron -f
www-data    1420  0.1  0.5 142100 24108 ?        S    04:12   0:00 nginx: master process /usr/sbin/nginx
sysadmin    1890  0.0  0.1  10234  3200 pts/0    Ss   04:15   0:00 bash
sysadmin    2010  0.0  0.0   9456  1820 pts/0    R+   04:20   0:00 ps aux`,
      };
    }

    case "sudo": {
      if (args.length === 0) return { error: "sudo: a command is required" };
      const subRes = executeCommand(args.join(" "), state);
      return subRes;
    }

    case "systemctl": {
      const action = args[0];
      const service = args[1]?.replace(/\.service$/, "");

      if (!action || !service) {
        return { error: "systemctl: invalid arguments" };
      }

      const svc = state.services[service];
      if (!svc) {
        return { error: `Unit ${service}.service not found.` };
      }

      if (action === "status") {
        return {
          output: `● ${service}.service - ${svc.description}
     Loaded: loaded (/lib/systemd/system/${service}.service; ${svc.enabled ? "enabled" : "disabled"})
     Active: ${svc.active ? "active (running)" : "inactive (dead)"} since Sat 2026-10-31 04:12:00 UTC
   Main PID: ${svc.pid} (${service})
     Tasks: 2 (limit: 4652)
     Memory: 24.2M
     CGroup: /system.slice/${service}.service
             └─${svc.pid} ${service}: master process`,
        };
      }

      if (action === "restart" || action === "start") {
        svc.active = true;
        svc.pid = Math.floor(Math.random() * 2000) + 1000;
        return {};
      }

      if (action === "stop") {
        svc.active = false;
        svc.pid = 0;
        return {};
      }

      return {};
    }

    default:
      return {
        error: `bash: ${cmd}: command not found. Type 'help' for suggestions.`,
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
