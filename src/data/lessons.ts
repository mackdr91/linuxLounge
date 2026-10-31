import { Lesson } from "@/types/lesson";

export const LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    slug: "the-shell-awakening",
    number: 1,
    title: "The Shell Awakening",
    tagline: "Filesystem Hierarchy Standard & Navigation",
    difficulty: "Beginner",
    estimatedMinutes: 10,
    xpReward: 100,
    overview:
      "Welcome to Linux! In this lesson, you will master navigating the Linux Filesystem Hierarchy Standard (FHS). You will discover where you are in the directory tree, inspect contents, and travel between directories without getting lost.",
    sections: [
      {
        id: "l1-s1",
        title: "Where Am I? (Print Working Directory)",
        body: "In Linux, everything is organized in a single inverted tree starting from the root directory `/`. To verify your exact location at any time, use the `pwd` command.",
        codeSnippets: [
          {
            label: "Check current working directory",
            command: "pwd",
            explanation: "Displays the absolute path of your current shell directory.",
          },
        ],
      },
      {
        id: "l1-s2",
        title: "Seeing the Unseen (Listing Files)",
        body: "The `ls` command lists items in the current directory. By default, hidden files (starting with `.`) are excluded. Adding `-l` gives detailed metadata (permissions, sizes, timestamps) and `-a` displays hidden dotfiles.",
        codeSnippets: [
          {
            label: "Basic directory listing",
            command: "ls",
            explanation: "Lists visible files and subdirectories.",
          },
          {
            label: "Detailed listing including hidden files",
            command: "ls -la",
            explanation: "Shows detailed file permissions, sizes in bytes, and hidden dotfiles like .bashrc.",
          },
        ],
      },
      {
        id: "l1-s3",
        title: "Moving Through Space (Changing Directories)",
        body: "Use `cd` to navigate directories. `cd ..` moves up one level to the parent directory, while `cd /` jumps directly to the root filesystem. Entering bare `cd` or `cd ~` always returns to your user's home directory.",
        codeSnippets: [
          {
            label: "Change directory into /var/log",
            command: "cd /var/log",
            explanation: "Switches current directory to system log files.",
          },
          {
            label: "Return home",
            command: "cd ~",
            explanation: "Returns straight to /home/sysadmin.",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-1-1",
        title: "Print Working Directory",
        instruction: "Run the `pwd` command to verify your initial starting location in the filesystem.",
        validationRegex: "^\\s*pwd\\s*$",
        hint: "Type `pwd` and press Enter.",
        xp: 25,
      },
      {
        id: "task-1-2",
        title: "List All Files (Including Hidden)",
        instruction: "Inspect the current directory with `ls -la` to view permissions and hidden configuration files.",
        validationRegex: "^\\s*ls\\s+(-[a-zA-Z]*l[a-zA-Z]*a[a-zA-Z]*|-[a-zA-Z]*a[a-zA-Z]*l[a-zA-Z]*)\\s*$",
        hint: "Run `ls -la` or `ls -al`.",
        xp: 35,
      },
      {
        id: "task-1-3",
        title: "Navigate to System Logs",
        instruction: "Change directory into `/var/log` using the `cd` command.",
        validationRegex: "^\\s*cd\\s+/var/log/?\\s*$",
        hint: "Execute `cd /var/log`.",
        xp: 40,
      },
    ],
    cheatSheet: [
      { command: "pwd", flags: "-", description: "Print working directory" },
      { command: "ls", flags: "-l -a -h", description: "List directory contents with details and hidden files" },
      { command: "cd", flags: "<path>", description: "Change working directory (e.g. cd .., cd ~, cd /)" },
      { command: "whoami", flags: "-", description: "Print current active username" },
    ],
  },
  {
    id: "lesson-2",
    slug: "file-sorcery",
    number: 2,
    title: "File Sorcery",
    tagline: "Creating, Reading, Moving, & Deleting Files",
    difficulty: "Beginner",
    estimatedMinutes: 12,
    xpReward: 120,
    overview:
      "Linux is built on the Unix philosophy: 'Everything is a file.' In this lesson, you will learn to create new directories, spawn files, inspect their contents with cat/head/tail, and organize them with cp and mv.",
    sections: [
      {
        id: "l2-s1",
        title: "Spawning Directories & Empty Files",
        body: "`mkdir` creates directories. `touch` creates an empty file if it does not exist, or updates its access timestamp if it does.",
        codeSnippets: [
          {
            label: "Create projects folder",
            command: "mkdir projects",
            explanation: "Creates a new subdirectory named 'projects'.",
          },
          {
            label: "Create a new file",
            command: "touch server.conf",
            explanation: "Creates an empty file named server.conf.",
          },
        ],
      },
      {
        id: "l2-s2",
        title: "Inspecting File Contents",
        body: "Use `cat` to print an entire file to stdout. For longer files, `head -n 5` prints the first 5 lines, and `tail -n 5` inspects the final lines (crucial for checking real-time logs).",
        codeSnippets: [
          {
            label: "Read file contents",
            command: "cat /etc/os-release",
            explanation: "Prints distribution release metadata to the terminal.",
          },
        ],
      },
      {
        id: "l2-s3",
        title: "Copying, Renaming & Removing",
        body: "`cp <src> <dest>` copies a file, while `mv <src> <dest>` renames or moves it. `rm <file>` deletes a file permanently (there is no recycle bin in Linux shell!).",
        codeSnippets: [
          {
            label: "Copy a file as a backup",
            command: "cp server.conf server.conf.bak",
            explanation: "Creates a backup copy named server.conf.bak.",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-2-1",
        title: "Create a Scripts Directory",
        instruction: "Use `mkdir` to create a directory named `scripts` in your home folder.",
        validationRegex: "^\\s*mkdir(\\s+-p)?\\s+scripts/?\\s*$",
        hint: "Run `mkdir scripts`.",
        xp: 35,
      },
      {
        id: "task-2-2",
        title: "Create a Deploy Script File",
        instruction: "Use `touch` to create an empty file named `deploy.sh`.",
        validationRegex: "^\\s*touch\\s+deploy\\.sh\\s*$",
        hint: "Type `touch deploy.sh`.",
        xp: 35,
      },
      {
        id: "task-2-3",
        title: "Inspect System Information",
        instruction: "Read the system release file using `cat /etc/os-release`.",
        validationRegex: "^\\s*cat\\s+/etc/os-release\\s*$",
        hint: "Run `cat /etc/os-release`.",
        xp: 50,
      },
    ],
    cheatSheet: [
      { command: "mkdir", flags: "-p", description: "Make directory (creates parent directories if -p)" },
      { command: "touch", flags: "<file>", description: "Create empty file or refresh timestamp" },
      { command: "cat", flags: "<file>", description: "Concatenate and print file contents" },
      { command: "cp", flags: "-r", description: "Copy files (use -r for directories)" },
      { command: "mv", flags: "<src> <dst>", description: "Move or rename files and directories" },
      { command: "rm", flags: "-r -f", description: "Remove files (use -rf cautiously for directories)" },
    ],
  },
  {
    id: "lesson-3",
    slug: "shielding-assets",
    number: 3,
    title: "Shielding Assets: Permissions & Ownership",
    tagline: "Octal Modes, User Groups, and Sudo Privilege",
    difficulty: "Intermediate",
    estimatedMinutes: 15,
    xpReward: 150,
    overview:
      "Linux security relies on strict file ownership and mode bitmasks. Every file is governed by permissions for the Owner, Group, and Others. Learn how to secure sensitive configurations and grant execute permissions.",
    sections: [
      {
        id: "l3-s1",
        title: "Decoding the Linux Permission Matrix",
        body: "When running `ls -l`, permissions appear as `rwxr-xr--`:\n- `r` (read) = 4\n- `w` (write) = 2\n- `x` (execute) = 1\n\nAdding these values creates octal codes: `7` (rwx), `6` (rw-), `5` (r-x), and `4` (r--).",
        codeSnippets: [
          {
            label: "Inspect file permissions",
            command: "ls -l",
            explanation: "Lists permissions for User, Group, and Others.",
          },
        ],
      },
      {
        id: "l3-s2",
        title: "Modifying Modes with chmod",
        body: "`chmod 755 <script>` makes a file executable for everyone but writable only by the owner. For sensitive keys or passwords, `chmod 600 <key>` restricts read and write strictly to the owner.",
        codeSnippets: [
          {
            label: "Make script executable",
            command: "chmod +x deploy.sh",
            explanation: "Grants execution privileges to run the script.",
          },
          {
            label: "Lock down sensitive credentials",
            command: "chmod 600 id_rsa",
            explanation: "Ensures only the file owner can read or write.",
          },
        ],
      },
      {
        id: "l3-s3",
        title: "Ownership & Superuser Elevation",
        body: "`chown <user>:<group> <file>` changes who owns a resource. When modifying system files outside your home directory, prepend `sudo` to execute with root administrative privileges.",
        codeSnippets: [
          {
            label: "Run administrative update",
            command: "sudo apt update",
            explanation: "Runs package index refresh with elevated root permissions.",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-3-1",
        title: "Make deploy.sh Executable",
        instruction: "Grant execute permissions to `deploy.sh` using either `chmod +x deploy.sh` or `chmod 755 deploy.sh`.",
        validationRegex: "^\\s*chmod\\s+(\\+x|755)\\s+deploy\\.sh\\s*$",
        hint: "Run `chmod +x deploy.sh` or `chmod 755 deploy.sh`.",
        xp: 45,
      },
      {
        id: "task-3-2",
        title: "Secure Private Key Permissions",
        instruction: "Set strict owner-only read/write permissions on `id_rsa` using `chmod 600 id_rsa`.",
        validationRegex: "^\\s*chmod\\s+600\\s+id_rsa\\s*$",
        hint: "Execute `chmod 600 id_rsa`.",
        xp: 50,
      },
      {
        id: "task-3-3",
        title: "Check System Uptime with Sudo",
        instruction: "Run `sudo uptime` to verify administrator execution privilege.",
        validationRegex: "^\\s*sudo\\s+uptime\\s*$",
        hint: "Type `sudo uptime`.",
        xp: 55,
      },
    ],
    cheatSheet: [
      { command: "chmod", flags: "755 / 600 / +x", description: "Change file mode bits and access permissions" },
      { command: "chown", flags: "<user>:<group>", description: "Change file owner and group" },
      { command: "sudo", flags: "<command>", description: "Execute a command with superuser (root) privileges" },
      { command: "id", flags: "-", description: "Print real and effective user and group IDs" },
    ],
  },
  {
    id: "lesson-4",
    slug: "streams-and-pipes",
    number: 4,
    title: "Pipes, Grep & Stream Redirection",
    tagline: "Connecting Shell Commands & Extracting Data",
    difficulty: "Intermediate",
    estimatedMinutes: 15,
    xpReward: 160,
    overview:
      "The true power of the Linux CLI emerges when you connect programs together. Standard output (`stdout`) can be piped (`|`) into another program's input (`stdin`), or redirected into files using `>` (overwrite) and `>>` (append).",
    sections: [
      {
        id: "l4-s1",
        title: "Redirecting Output with > and >>",
        body: "`command > file` captures output and saves it into a file, overwriting existing content. `command >> file` appends the output to the end of the file without overwriting.",
        codeSnippets: [
          {
            label: "Write output to file",
            command: "echo 'Server initialized' > startup.log",
            explanation: "Creates or overwrites startup.log with the text.",
          },
          {
            label: "Append timestamp to file",
            command: "date >> startup.log",
            explanation: "Appends the current system date and time to the log.",
          },
        ],
      },
      {
        id: "l4-s2",
        title: "Filtering Streams with Grep",
        body: "`grep` searches input for lines matching a pattern. Combined with a pipe `|`, you can search live command output without manual scrolling.",
        codeSnippets: [
          {
            label: "Search for error in logs",
            command: "grep -i 'error' /var/log/syslog",
            explanation: "Finds all case-insensitive occurrences of 'error'.",
          },
          {
            label: "Count matching lines",
            command: "cat /etc/passwd | wc -l",
            explanation: "Pipes passwd into word count to count total system user accounts.",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-4-1",
        title: "Redirect Echo Output",
        instruction: "Write the text 'production' into a file named `env.txt` using `echo 'production' > env.txt`.",
        validationRegex: "^\\s*echo\\s+['\"]?production['\"]?\\s*>\\s*env\\.txt\\s*$",
        hint: "Run `echo 'production' > env.txt`.",
        xp: 45,
      },
      {
        id: "task-4-2",
        title: "Filter Active Users with Grep",
        instruction: "Search for the user `sysadmin` inside `/etc/passwd` using `grep sysadmin /etc/passwd`.",
        validationRegex: "^\\s*grep\\s+sysadmin\\s+/etc/passwd\\s*$",
        hint: "Type `grep sysadmin /etc/passwd`.",
        xp: 55,
      },
      {
        id: "task-4-3",
        title: "Count Directory Items via Pipe",
        instruction: "Pipe directory listing into line count using `ls /etc | wc -l`.",
        validationRegex: "^\\s*ls\\s+/etc\\s*\\|\\s*wc\\s+-l\\s*$",
        hint: "Run `ls /etc | wc -l`.",
        xp: 60,
      },
    ],
    cheatSheet: [
      { command: ">", flags: "<file>", description: "Redirect stdout to file (overwrite)" },
      { command: ">>", flags: "<file>", description: "Redirect stdout to file (append)" },
      { command: "|", flags: "<cmd2>", description: "Pipe stdout of cmd1 into stdin of cmd2" },
      { command: "grep", flags: "-i -r -n", description: "Search for lines matching a regex pattern" },
      { command: "wc", flags: "-l -w -c", description: "Print newline, word, and byte counts" },
    ],
  },
  {
    id: "lesson-5",
    slug: "service-maestro",
    number: 5,
    title: "Service Maestro: Process Control & Systemd",
    tagline: "Inspecting Daemons, Managing Services, & Resource Health",
    difficulty: "Advanced",
    estimatedMinutes: 20,
    xpReward: 200,
    overview:
      "Linux servers run dozens of background background daemons managed by the `systemd` init manager. In this final lesson, you will master inspecting running processes, terminating rogue tasks, and controlling production web services with `systemctl`.",
    sections: [
      {
        id: "l5-s1",
        title: "Inspecting Running Processes (ps & top)",
        body: "`ps aux` displays a snapshot of every running process on the system, including its Process ID (`PID`), CPU%, and Memory usage. `top` provides an interactive live dashboard.",
        codeSnippets: [
          {
            label: "Snapshot of all system processes",
            command: "ps aux",
            explanation: "Lists every active process with user owner and PID.",
          },
          {
            label: "Filter for a specific daemon",
            command: "ps aux | grep nginx",
            explanation: "Finds the exact process ID running NGINX.",
          },
        ],
      },
      {
        id: "l5-s2",
        title: "Managing Services with Systemd (systemctl)",
        body: "`systemctl` controls background daemons. You can query service health (`status`), start or stop units, and enable them to start automatically on system boot.",
        codeSnippets: [
          {
            label: "Check web server status",
            command: "sudo systemctl status nginx",
            explanation: "Shows whether NGINX is currently active (running), its PID, and recent logs.",
          },
          {
            label: "Restart a service",
            command: "sudo systemctl restart nginx",
            explanation: "Gracefully reloads the service configuration without machine reboot.",
          },
        ],
      },
      {
        id: "l5-s3",
        title: "Terminating Processes (kill & killall)",
        body: "When a process becomes unresponsive, send it an OS termination signal using `kill <PID>` (graceful `SIGTERM`) or `kill -9 <PID>` (`SIGKILL`).",
        codeSnippets: [
          {
            label: "Terminate process by PID",
            command: "kill 1420",
            explanation: "Sends SIGTERM to gracefully shut down process 1420.",
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-5-1",
        title: "Inspect Process Table",
        instruction: "Run `ps aux` to view all active processes and their PIDs.",
        validationRegex: "^\\s*ps\\s+(aux|-ef)\\s*$",
        hint: "Type `ps aux`.",
        xp: 50,
      },
      {
        id: "task-5-2",
        title: "Check NGINX Service Health",
        instruction: "Inspect the status of the NGINX web server daemon using `sudo systemctl status nginx`.",
        validationRegex: "^\\s*(sudo\\s+)?systemctl\\s+status\\s+nginx(\\.service)?\\s*$",
        hint: "Run `sudo systemctl status nginx`.",
        xp: 70,
      },
      {
        id: "task-5-3",
        title: "Restart NGINX Service",
        instruction: "Restart the web server using `sudo systemctl restart nginx`.",
        validationRegex: "^\\s*(sudo\\s+)?systemctl\\s+restart\\s+nginx(\\.service)?\\s*$",
        hint: "Execute `sudo systemctl restart nginx`.",
        xp: 80,
      },
    ],
    cheatSheet: [
      { command: "ps", flags: "aux", description: "Report a snapshot of the current processes" },
      { command: "systemctl", flags: "status / start / stop / restart", description: "Control the systemd system and service manager" },
      { command: "kill", flags: "<PID> / -9 <PID>", description: "Send a signal to a process (SIGTERM or SIGKILL)" },
      { command: "journalctl", flags: "-u <unit> -f", description: "Query and live-follow systemd service logs" },
    ],
  },
];
