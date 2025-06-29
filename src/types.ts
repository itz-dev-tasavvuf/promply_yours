import { IconType } from './components/Icons';

export interface NavItem {
  name: string;
  path: string;
  icon?: IconType; // Icon component name or key
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: IconType;
}

export interface FeaturePoint {
  id: number;
  title: string;
  description: string;
  icon: IconType;
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl: string;
  quote: string;
  projectName: string;
  projectImageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  aiModelUsed: string;
  tags?: string[];
}

export interface AiService {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  category: string;
}

export interface AiModel {
  id: string;
  name: string;
  provider: string; // e.g., "Gemini", "OpenAI"
  costPerTask: string;
  performanceMetrics: {
    accuracy?: string;
    speed?: string;
    quality?: string;
  };
  description: string;
  tags: string[];
  icon: IconType;
}

export interface Recommendation extends AiService {}

// For Gemini Service
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// User object representing the authenticated user
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Add other user-related fields if needed
}

// For AI Content Writer Page
export interface ContentPlanStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  content: string;
}

// For Proofreading & Editing Page
export type SuggestionType = 'Spelling' | 'Grammar' | 'Punctuation' | 'Style' | 'Clarity' | 'Other';

export interface ProofreadingSuggestion {
  original: string;
  corrected: string;
  type: SuggestionType;
  explanation: string;
}

export interface ProofreadingResult {
  summary: string;
  suggestions: ProofreadingSuggestion[];
  correctedText: string;
}

// For Data Entry & Extraction Page
export type PredefinedModelType = 'invoice' | 'receipt';

export interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  originalValue: string; // To compare against user edits
}

export interface ExtractionResult {
  fields: ExtractedField[];
}

// For Resume/Cover Letter Builder
export interface ResumeAnalysisSuggestion {
  area: string; // e.g., "Skills", "Experience", "Formatting"
  suggestion: string;
}

export interface ResumeOptimizationResult {
  optimizedResume: string;
  coverLetter: string;
  suggestions: ResumeAnalysisSuggestion[];
}

// --- AI Arcade Builder & Mini-Games ---

export type MiniGameType = 'crash' | 'mines' | 'slot777' | 'balloonPump';

export interface CrashConfig {
    type: 'crash';
    baseStake: number;
    growthFactor: number; // e.g., 0.06 for a nice curve
    autoCashoutAllowed: boolean;
}

export interface MinesConfig {
  type: 'mines';
  rows: number;
  cols: number;
  mines: number;
  baseStake: number;
  multiplierPerSafe: number;
}

export interface Slot777Config {
  type: 'slot777';
  reels: number;
  symbols: string[];
  paytable: Record<string, number>;
  baseStake: number;
  wildSymbol: string | null;
}

export interface BalloonPumpConfig {
  type: 'balloonPump';
  maxSafePumps: number;
  baseStake: number;
  multiplierPerPump: number;
}

export interface WebAppConfig {
    appName: string;
    tagline: string;
    logoType: 'upload' | 'generate';
    logoPrompt: string;
    logoFile: File | null;
    logoUrl: string;
    primaryColor: string;
    games: {
        crash: boolean;
        mines: boolean;
        slot777: boolean;
        balloonPump: boolean;
    };
    crashConfig: CrashConfig;
    minesConfig: MinesConfig;
    slot777Config: Slot777Config;
    balloonPumpConfig: BalloonPumpConfig;
    gameConductor: boolean; // Controls "smart AI" for games
}

export interface GeneratedFile {
    path: string;
    content: string;
}

export interface GeneratedProject {
    files: GeneratedFile[];
    zipName: string;
}


export interface DeploymentStep {
    status: 'info' | 'success' | 'error' | 'provider';
    message: string;
    provider?: 'SupabaseIcon' | 'NetlifyIcon' | 'GitHubIcon';
}