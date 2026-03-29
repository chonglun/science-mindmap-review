/** A single past-exam question attached to a topic. */
export interface PastExamQuestion {
  year: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

/** Strategy content for exam preparation — topic level. */
export interface ExamStrategy {
  examinerThinking: string;
  solvingSteps: string[];
  thinkingRules: string[];
}

/** Unit-level strategy overview. */
export interface UnitStrategy {
  examinerPerspective: string;
  scoringTips: string[];
  commonTraps: string[];
  thinkingPath: string;
}

/** A leaf-level topic inside a unit (or directly under a flat subject). */
export interface Topic {
  id: string;
  name: string;
  hook: string;
  coreConcepts: string[];
  pastExamQuestions: PastExamQuestion[];
  examStrategy?: ExamStrategy;
}

/** Importance metadata attached to a unit. */
export interface UnitImportance {
  stars: number;
  level: string;
  tip: string;
}

/** A unit grouping topics within a subject. */
export interface Unit {
  id: string;
  name: string;
  stage: string;
  importance?: UnitImportance;
  topics: Topic[];
  unitStrategy?: UnitStrategy;
}

/**
 * Full subject data loaded from JSON.
 * Standard format uses `units`; legacy flat format uses `topics` directly.
 */
export interface SubjectData {
  id: string;
  label: string;
  color: string;
  units?: Unit[];
  topics?: Topic[];
}