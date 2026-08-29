// ============================================================
// PockTalk:AI - API Ports/Controllers層のインターフェース定義
// ============================================================
import type {
    EmotionVector,
    PersonaArchetype,
    TranscriptTurn,
} from './session-state';
import type { ReactionCategory, StrikeIntensity } from './core-modules';

export interface ConfidenceSpan {
    text: string;
    confidence: number;
    startCharIndex: number;
    endCharIndex: number;
}

export interface TranscriptSegment {
    text: string;
    isFinal: boolean;
    spans: ConfidenceSpan[];
    aggregateConfidence?: number;
}

export interface STTStreamCallbacks {
    onInterimResult: (result: TranscriptSegment) => void;
    onFinalResult: (result: TranscriptSegment) => void;
    onError: (error: Error) => void;
}

export interface ISTTStreamHandle {
    pushAudioChunk(chunk: Uint8Array): void;
    end(): void;
}

export interface ISTTPort {
    startStream(callbacks: STTStreamCallbacks): ISTTStreamHandle;
}

export interface GenerateResponseInput {
    turnId: number;
    reactionCategory: ReactionCategory;
    strikeIntensity: StrikeIntensity | null;
    emotion: EmotionVector;
    targetKeywordId: string | null;
    hintText: string | null;
    recentTranscript: TranscriptTurn[];
    personaArchetype: PersonaArchetype;
}

export interface ResponseSentenceChunk {
    turnId: number;
    sentenceIndex: number;
    text: string;
}

export interface IResponseGenerator {
    generate(
        input: GenerateResponseInput,
        onSentence: (chunk: ResponseSentenceChunk) => void
    ): Promise<void>;
    abort(turnId: number): void;
}

export interface SynthesizeInput {
    turnId: number;
    sentenceIndex: number;
    text: string;
    emotion: EmotionVector;
}

export interface ITTSPort {
    synthesize(
        input: SynthesizeInput,
        onAudioChunk: (chunk: Uint8Array) => void
    ): Promise<void>;
    cancel(turnId: number): void;
    getCachedPhrase(phraseId: string): Uint8Array | null;
}

export type FillerTone = 'thinking' | 'hesitant';
export const FILLER_THRESHOLD_MS = 350;

export interface FillerDecisionInput {
    turnId: number;
    elapsedMsSinceSpeechEnd: number;
    hasEarlyContradictionSignal: boolean;
}

export interface IFillerController {
    shouldTrigger(input: FillerDecisionInput): boolean;
    selectTone(hasEarlyContradictionSignal: boolean): FillerTone;
}