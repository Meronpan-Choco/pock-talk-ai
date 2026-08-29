// ============================================================
// PockTalk:AI- セッション状態の型定義 (SessionStore)
// 基本設計書 v0.6 準拠
// ============================================================

export interface EmotionVector {
    joy: number;
    sorrow: number;
    surprise: number;
    anxiety: number;
}

export const EMOTION_ORDER = ['joy', 'sorrow', 'surprise', 'anxiety'] as const;

export function emotionToArray(e: EmotionVector): Float64Array {
    return Float64Array.from(EMOTION_ORDER.map((k) => e[k]));
}

export function arrayToEmotion(arr: Float64Array): EmotionVector {
    const [joy, sorrow, surprise, anxiety] = arr;
    return { joy, sorrow, surprise, anxiety };
}

export const confusionOf = (e: EmotionVector): number => e.anxiety / 100;

export type EventFlag =
    | 'is_keyword_hit'
    | 'is_concrete'
    | 'is_abstract'
    | 'is_contradiction'
    | 'is_interrupted'
    | 'is_forced_topic_shift'
    | 'is_strike_normal'
    | 'is_strike_weak'
    | 'is_strike_strong';

export interface TranscriptTurn {
    turnId: number;
    speaker: 'user' | 'ai';
    text: string;
    timestampMs: number;
    confidence?: number;
}

export interface EventLogEntry {
    turnId: number;
    flags: EventFlag[];
}

export type Difficulty = 'easy' | 'normal' | 'hard';
export type PersonaArchetype = 'cautious' | 'standard' | 'pushy';

export interface KeywordDefinition {
    id: string;
    label: string;
    importance: number;
    landingPoint: number;
    embedding: number[];
    topicAngle: string;
    hintExamples: string[];
}

export interface KeywordRuntimeState {
    achieved: boolean;
    achievedAtTurnId: number | null;
    missCounter: number;
}

export interface InputPhasePlan {
    elements: { id: string; text: string }[];
    groups: string[][];
}

export type SessionPhase = 'input' | 'output' | 'completed';

export interface SessionState {
    sessionId: string;
    themeId: string;
    difficulty: Difficulty;
    personaArchetype: PersonaArchetype;
    voiceId: string | null;
    phase: SessionPhase;
    phaseStartedAt: number;
    emotion: EmotionVector;
    themeKeywords: KeywordDefinition[];
    checklist: Record<string, KeywordRuntimeState>;
    inputPhasePlan: InputPhasePlan | null;
    transcript: TranscriptTurn[];
    eventLog: EventLogEntry[];
    currentTargetKeywordId: string | null;
}

export interface SessionStore {
    create(
        sessionId: string,
        themeId: string,
        difficulty: Difficulty,
        personaArchetype: PersonaArchetype,
        themeKeywords: KeywordDefinition[]
    ): SessionState;
    get(sessionId: string): SessionState | undefined;
    update(sessionId: string, updater: (state: SessionState) => void): SessionState;
    appendTranscriptTurn(sessionId: string, turn: TranscriptTurn): void;
    appendEventLog(sessionId: string, entry: EventLogEntry): void;
    delete(sessionId: string): void;
}