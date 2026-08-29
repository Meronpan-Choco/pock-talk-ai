// ============================================================
// PockTalk:AI - WebSocketメッセージプロトコル
// ============================================================
import type {
    Difficulty,
    PersonaArchetype,
    EmotionVector,
    InputPhasePlan,
} from './session-state';
import type { ConfidenceSpan } from './api-ports';

export type C2S_SessionInit = {
    type: 'session.init';
    themeId: string;
    difficulty: Difficulty;
    personaArchetype: PersonaArchetype;
};

export type C2S_InputPhasePlanSubmit = {
    type: 'session.inputPhasePlan.submit';
    plan: InputPhasePlan;
};

export type C2S_VadEvent = {
    type: 'audio.vadEvent';
    event: 'speechStart' | 'speechEnd' | 'bargeIn';
    timestampMs: number;
};

export type C2S_SessionEnd = {
    type: 'session.end';
    reason: 'timeUp' | 'userAborted';
};

export type C2S_SessionResume = {
    type: 'session.resume';
    sessionId: string;
};

export type ClientToServerMessage =
    | C2S_SessionInit
    | C2S_InputPhasePlanSubmit
    | C2S_VadEvent
    | C2S_SessionEnd
    | C2S_SessionResume;

export type S2C_SessionReady = {
    type: 'session.ready';
    sessionId: string;
};

export type S2C_TranscriptUpdate = {
    type: 'transcript.update';
    turnId: number;
    text: string;
    isFinal: boolean;
    spans: ConfidenceSpan[];
};

export type S2C_EmotionUpdate = {
    type: 'emotion.update';
    emotion: EmotionVector;
};

export type S2C_ChecklistUpdate = {
    type: 'checklist.update';
    achievedCount: number;
    totalCount: number;
};

export type S2C_TtsState = {
    type: 'tts.state';
    turnId: number;
    state: 'start' | 'stop';
};

export type S2C_AudioFillerTrigger = {
    type: 'audio.fillerTrigger';
    turnId: number;
};

export type S2C_HintShow = {
    type: 'hint.show';
    turnId: number;
    text: string;
};

export type S2C_Error = {
    type: 'error';
    code: string;
    message: string;
};

export type ServerToClientMessage =
    | S2C_SessionReady
    | S2C_TranscriptUpdate
    | S2C_EmotionUpdate
    | S2C_ChecklistUpdate
    | S2C_TtsState
    | S2C_AudioFillerTrigger
    | S2C_HintShow
    | S2C_Error;

export enum BinaryFrameType {
    UserMicChunk = 1,
    AiTtsChunk = 2,
}