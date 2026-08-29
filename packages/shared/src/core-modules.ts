// ============================================================
// PockTalk:AI - コアロジックモジュールのインターフェース定義
// ============================================================
import type {
    Difficulty,
    PersonaArchetype,
    EmotionVector,
    EventFlag,
    KeywordDefinition,
    KeywordRuntimeState,
    TranscriptTurn,
} from './session-state';

export type ReactionCategory = 'question' | 'rebuttal' | 'acknowledgment';
export type StrikeIntensity = 'normal' | 'weak' | 'strong';

export interface EvaluateTurnInput {
    turnId: number;
    userText: string;
    confidence: number;
    themeKeywords: KeywordDefinition[];
    currentChecklist: Record<string, KeywordRuntimeState>;
    currentTargetKeywordId: string | null;
    recentTranscript: TranscriptTurn[];
}

export interface ReactionResult {
    updatedChecklist: Record<string, KeywordRuntimeState>;
    reactionCategory: ReactionCategory;
    strikeIntensity: StrikeIntensity | null;
    eventFlags: EventFlag[];
}

export interface IReactionLogicEngine {
    evaluate(input: EvaluateTurnInput): ReactionResult;
}

export interface UpdateEmotionInput {
    currentEmotion: EmotionVector;
    eventFlags: EventFlag[];
    personaArchetype: PersonaArchetype;
}

export interface EmotionResult {
    updatedEmotion: EmotionVector;
    confusionLevel: number;
}

export interface IEmotionEngine {
    update(input: UpdateEmotionInput): EmotionResult;
}

export interface SelectTargetInput {
    themeKeywords: KeywordDefinition[];
    currentChecklist: Record<string, KeywordRuntimeState>;
    recentUserUtteranceEmbeddings: number[][];
    emotion: EmotionVector;
    difficulty: Difficulty;
    personaArchetype: PersonaArchetype;
    remainingTimeSec: number;
}

export interface GuidanceResult {
    targetKeywordId: string | null;
    hintText: string | null;
}

export interface IKeywordGuidanceModel {
    selectTarget(input: SelectTargetInput): GuidanceResult;
}