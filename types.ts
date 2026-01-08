
export enum AppView {
  DASHBOARD = 'dashboard',
  INCUBATION = 'incubation',
  CIRCUITS = 'circuits',
  EVALUATION = 'evaluation',
  KNOWLEDGE = 'knowledge',
  AI_ASSISTANT = 'ai_assistant',
  PODCAST = 'podcast'
}

export interface Program {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'completed';
  cohortSize: number;
  startDate: string;
  progress: number;
}

export interface Circuit {
  id: string;
  title: string;
  theme: 'Culture' | 'Patrimoine' | 'Artisanat' | 'Nature' | 'Gastronomie';
  location: string;
  status: 'Testing' | 'Validated' | 'Concept';
  impactScore: number;
}
