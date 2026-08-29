import { WebSocketServer, WebSocket } from 'ws';
import type {
    ClientToServerMessage,
    ServerToClientMessage,
} from '@pocktalk/shared';
import { BinaryFrameType } from '@pocktalk/shared';

// TODO: 後ほど実装するSessionOrchestratorの型をインポートして注入する予定ですが、
// 今回は枠組みの構築のみにとどめます。
// import { SessionOrchestrator } from './SessionOrchestrator';

export class PockTalkWebSocketServer {
    private wss: WebSocketServer;
    // private orchestrator: SessionOrchestrator;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        // this.orchestrator = new SessionOrchestrator();

        this.wss.on('listening', () => {
        console.log(`WebSocket Server is listening on port ${port}`);
        });

        this.wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');
        this.setupClient(ws);
        });
    }

    private setupClient(ws: WebSocket) {
        ws.on('message', (data: Buffer, isBinary: boolean) => {
            if (isBinary) {
                this.handleBinaryMessage(ws, data);
            } else {
                this.handleTextMessage(ws, data.toString('utf-8'));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            // TODO: 切断時の処理 (orchestratorへの通知、猶予期間のタイマー起動など)
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    private handleTextMessage(ws: WebSocket, text: string) {
        try {
            const message = JSON.parse(text) as ClientToServerMessage;
            console.log(`[WS JSON] Received: ${message.type}`);

            // TODO: message.type に応じて orchestrator の適切なメソッドを呼び出す
            // 例: this.orchestrator.handleMessage(ws, message);
        } catch (error) {
            console.error('Failed to parse JSON message:', error);
        }
    }

    private handleBinaryMessage(ws: WebSocket, data: Buffer) {
        // ヘッダ (1byte: Type, 4byte: turnId) の5バイト未満は不正
        if (data.length < 5) {
            console.error('Invalid binary frame: too short');
            return;
        }

        const frameType = data.readUInt8(0);
        const turnId = data.readUInt32LE(1);
        const payload = data.subarray(5);

        if (frameType === BinaryFrameType.UserMicChunk) {
        // console.log(`[WS BINARY] UserMicChunk - turnId: ${turnId}, size: ${payload.length}`);
        // TODO: orchestrator経由でSTTポートにチャンクを流し込む
        // this.orchestrator.handleAudioChunk(turnId, payload);
        } else {
            console.warn(`[WS BINARY] Unknown frame type: ${frameType}`);
        }
    }

    // ============================================================
    // サーバーからクライアントへの送信ユーティリティ
    // ============================================================

    /**
    * JSON制御メッセージを送信する
    */
    public static sendJson(ws: WebSocket, message: ServerToClientMessage) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    /**
    * AIのTTS音声チャンク（バイナリ）を送信する
    */
    public static sendAiAudioChunk(ws: WebSocket, turnId: number, audioData: Uint8Array) {
        if (ws.readyState === WebSocket.OPEN) {
            // ヘッダ (5バイト) + 音声データ
            const header = Buffer.alloc(5);
            header.writeUInt8(BinaryFrameType.AiTtsChunk, 0); // byte 0: Type=2
            header.writeUInt32LE(turnId, 1);                  // byte 1-4: turnId (Little Endian)[cite: 2]

            const frame = Buffer.concat([header, audioData]);
            ws.send(frame, { binary: true });
        }
    }
}