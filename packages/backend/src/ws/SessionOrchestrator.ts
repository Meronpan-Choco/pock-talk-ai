import { WebSocket } from 'ws';
import type { ClientToServerMessage, KeywordDefinition } from '@pocktalk/shared';
import { PockTalkWebSocketServer } from './WebSocketServer';

// 具象クラスをインポート
import { InMemorySessionStore } from '../session/SessionStore';
import { ReactionLogicEngine } from '../logic/ReactionLogicEngine';
import { EmotionEngine } from '../logic/EmotionEngine';
import { KeywordGuidanceModel } from '../logic/KeywordGuidanceModel';

export class SessionOrchestrator {
    private sessionStore: InMemorySessionStore;
    private reactionEngine: ReactionLogicEngine;
    private emotionEngine: EmotionEngine;
    private guidanceModel: KeywordGuidanceModel;

    // 接続中のWebSocketインスタンスとSessionIDを紐づける管理マップ
    private wsToSessionId = new Map<WebSocket, string>();

    constructor() {
        this.sessionStore = new InMemorySessionStore();
        this.reactionEngine = new ReactionLogicEngine();
        this.emotionEngine = new EmotionEngine();
        this.guidanceModel = new KeywordGuidanceModel();
    
        // TODO: STTPort, TTSPort, ResponseGenerator, FillerController のインスタンス生成もここで行う
    }

    /**
    * JSONテキストメッセージのルーティング
    */
    public handleTextMessage(ws: WebSocket, message: ClientToServerMessage) {
        switch (message.type) {
            case 'session.init':
            this.handleSessionInit(ws, message);
            break;

            case 'session.inputPhasePlan.submit':
            // TODO: インプットフェーズの構成案を受信、アウトプットフェーズ(17.5分)の開始処理
            break;

            case 'audio.vadEvent':
            // TODO: VADイベント (speechStart, speechEnd, bargeIn) のハンドリング
            break;

            case 'session.end':
            // TODO: セッション終了処理 (DB保存、切断など)
            break;

            case 'session.resume':
            // TODO: 猶予期間内の再接続処理
            break;

            default:
            console.warn('Unknown message type:', (message as any).type);
        }
    }

    /**
    * ユーザーの音声バイナリチャンクのハンドリング
    */
    public handleAudioChunk(ws: WebSocket, turnId: number, payload: Buffer) {
        const sessionId = this.wsToSessionId.get(ws);
        if (!sessionId) {
            console.warn('Received audio chunk but no active session found for this WebSocket.');
            return;
        }
        // TODO: sessionIdに紐づくSTTPortのストリームに対して pushAudioChunk(payload) を呼び出す
    }

    /**
    * WebSocket切断時のハンドリング
    */
    public handleDisconnect(ws: WebSocket) {
        const sessionId = this.wsToSessionId.get(ws);
        if (sessionId) {
            console.log(`[Orchestrator] Client disconnected. Session: ${sessionId}`);
            // TODO: 再接続の猶予期間タイマーを開始する処理
            this.wsToSessionId.delete(ws);
        }
    }

    // ============================================================
    // 個別メッセージハンドラ
    // ============================================================

    private handleSessionInit(
        ws: WebSocket,
        message: Extract<ClientToServerMessage, { type: 'session.init' }>
    ){
        // 新規セッションIDの発行 (本来はUUIDなどを利用)
        const sessionId = `sess_${Date.now()}`;
        this.wsToSessionId.set(ws, sessionId);

        // TODO: 外部設定ファイル等からテーマキーワードをロードする処理 (現在は空配列)
        const mockKeywords: KeywordDefinition[] = [];

        // インメモリDBにセッション状態を新規作成
        this.sessionStore.create(
            sessionId,
            message.themeId,
            message.difficulty,
            message.personaArchetype,
            mockKeywords
        );

        console.log(`[Orchestrator] Created session: ${sessionId}`);

        // クライアントへ session.ready (sessionId確定) を返却[cite: 2]
        PockTalkWebSocketServer.sendJson(ws, {
            type: 'session.ready',
            sessionId,
        });
    }
}