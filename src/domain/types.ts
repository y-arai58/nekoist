export const attributeIds = [
  "affectionIntensity", "affectionRange", "companionship", "protectiveness",
  "freedomRespect", "observation", "curiosity", "touchDesire", "worship",
  "evangelism", "catPriority", "protectedFeeling",
] as const;

export type AttributeId = (typeof attributeIds)[number];
export type AttributeScores = Record<AttributeId, number>;
export type AnswerValue = 1 | 2 | 3 | 4 | 5;
export type Answers = Record<number, AnswerValue>;
export type QuestionSide = { label: string; primary: AttributeId; secondary: AttributeId };
export type Question = { id: number; prompt: string; left: QuestionSide; right: QuestionSide };
export type ResultKind = "normal" | "awakening";
export type ResultType = {
  id: string;
  kind: ResultKind;
  name: string;
  emoji: string;
  lead: string;
  description: string;
  traits: [string, string, string];
};
export type DiagnosisResult = {
  type: ResultType;
  attributes: AttributeScores;
  fitScore: number;
  awakeningCandidates: string[];
};
