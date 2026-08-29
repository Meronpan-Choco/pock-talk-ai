import type {
    SessionState,
    SessionStore,
    Difficulty,
    PersonaArchetype,
    KeywordDefinition,
    TranscriptTurn,
    EventLogEntry,
} from '@pocktalk/shared';

export class InMemorySessionStore implements SessionStore {
    private store = new Map<string, SessionState>();

    create(
        sessionId: string,
        themeId: string,
        difficulty: Difficulty,
        personaArchetype: PersonaArchetype,
        themeKeywords: KeywordDefinition[]
    ): SessionState {
        const initialState: SessionState = {
        sessionId,
        themeId,
        difficulty,
        personaArchetype,
        voiceId: null,
        phase: 'input',
        phaseStartedAt: Date.now(),
        // 感情の初期値 (5章に基づく)
        emotion: { joy: 0, sorrow: 0, surprise: 0, anxiety: 0 },
        themeKeywords,
        checklist: {}, // キーワードごとの進捗はセッション開始後に初期化される
        inputPhasePlan: null,
        transcript: [],
        eventLog: [],
        currentTargetKeywordId: null,
        };

        this.store.set(sessionId, initialState);
        return initialState;
    }

    get(sessionId: string): SessionState | undefined {
        return this.store.get(sessionId);
    }

    update(sessionId: string, updater: (state: SessionState) => void): SessionState {
        const state = this.store.get(sessionId);
        if (!state) throw new Error(`Session ${sessionId} not found`);
        
        // 参照を直接更新する (インメモリ用途のシンプルな実装)
        updater(state);
        return state;
    }

    appendTranscriptTurn(sessionId: string, turn: TranscriptTurn): void {
        this.update(sessionId, (state) => {
        state.transcript.push(turn);
        });
    }

    appendEventLog(sessionId: string, entry: EventLogEntry): void {
        this.update(sessionId, (state) => {
        state.eventLog.push(entry);
        });
    }

    delete(sessionId: string): void {
        this.store.delete(sessionId);
    }
}