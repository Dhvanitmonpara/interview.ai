export type RoundType = "aptitude" | "technical" | "behavioral" | "system-design";

export type QuestionAnswerType = {
  question: string;
  answer: string | string[] | { code: string; language: string };
  round: RoundType;
  timeLimit: number;
};

export type JobRoleType =
  | "front-end"
  | "back-end"
  | "full-stack"
  | "ai-engineer"
  | "network-engineer"
  | "cloud-architect"
  | "data-analyst"
  | "python-developer"
  | "js-developer"
  | "java-developer"
  | "android-developer";

export type AboutCandidateType = {
  name: string;
  yearsOfExperience: number;
  jobRole: JobRoleType;
  skills: string[];
};
