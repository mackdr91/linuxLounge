export interface CodeSnippet {
  label: string;
  command: string;
  explanation: string;
}

export interface LessonSection {
  id: string;
  title: string;
  body: string;
  codeSnippets?: CodeSnippet[];
}

export interface LabTask {
  id: string;
  title: string;
  instruction: string;
  validationRegex: string;
  hint: string;
  xp: number;
}

export interface CheatSheetEntry {
  command: string;
  flags: string;
  description: string;
}

export interface Lesson {
  id: string;
  slug: string;
  number: number;
  title: string;
  tagline: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  xpReward: number;
  overview: string;
  sections: LessonSection[];
  tasks: LabTask[];
  cheatSheet: CheatSheetEntry[];
}
