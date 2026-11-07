export type CalculatorMode =
  | 'standard'
  | 'scientific'
  | 'programmer'
  | 'fractions'
  | 'converter'
  | 'finance'
  | 'graphs';

export interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  showDerivative?: boolean;
  label?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type AngleMode = 'DEG' | 'RAD';

export type ProgrammerBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';

export type WordSize = 'QWORD' | 'DWORD' | 'WORD' | 'BYTE';

export type AppTheme =
  | 'win-dark'
  | 'win-light'
  | 'mac-dark'
  | 'mac-light'
  | 'cyberpunk'
  | 'retro-win98'
  | 'nordic'
  | 'oled'
  | 'sakura'
  | 'aurora-cosmic'
  | 'obsidian-gold'
  | 'synthwave-80s'
  | 'emerald-glass'
  | 'paper-notebook';

export type AccentColor = 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';

export type AnimatedBackgroundMode = 'aurora' | 'particles' | 'matrix' | 'waves' | 'off';

export interface CalculationStep {
  stepNumber: number;
  description: string;
  subExpression: string;
  subResult: string;
  resultingExpression: string;
}

export interface CalculationRecord {
  id: string;
  timestamp: number;
  expression: string;
  result: string;
  rawResult: number;
  steps: CalculationStep[];
  note?: string;
  mode: CalculatorMode;
}

export interface MemoryItem {
  id: string;
  value: number;
  timestamp: number;
}

export type DeviceMode = 'phone' | 'tablet' | 'pc';

export interface AppSettings {
  theme: AppTheme;
  accentColor: AccentColor;
  keySoundType: 'mechanical' | 'soft' | 'beep' | 'off';
  decimalPlaces: number;
  autoExpandSteps: boolean;
  historyLimit: number;
  animatedBg?: AnimatedBackgroundMode;
  animationsEnabled?: boolean;
  deviceMode?: DeviceMode;
}

export type ProblemSubject =
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'geometry'
  | 'economics'
  | 'biology'
  | 'cs'
  | 'other';

export interface ProblemParameter {
  symbol?: string;
  label: string;
  value: string;
  raw?: string;
  unit?: string;
}

export interface ProblemToFindItem {
  symbol: string;
  description: string;
}

export interface ProblemSolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  calculation?: string;
  unitCheck?: string;
}

export interface ProblemComputationItem {
  id: string;
  name: string;
  formula: string;
  expression: string;
  result: string;
  unit?: string;
}

export interface ProblemComputationBlock {
  primaryExpression: string;
  recommendedMode: 'standard' | 'scientific' | 'fractions' | 'finance' | 'graphs';
  computations: ProblemComputationItem[];
  graphSuggestion?: string;
}

export interface AiProblemSolution {
  id: string;
  subject: ProblemSubject;
  subjectTitle: string;
  topic: string;
  problemStatement: string;
  givenData: ProblemParameter[];
  siConversions?: string[];
  toFind?: ProblemToFindItem[];
  lawsAndFormulas?: string[];
  solutionSteps: ProblemSolutionStep[];
  finalAnswer: string;
  computationBlock: ProblemComputationBlock;
  confidence?: number;
  explanation?: string;
}


