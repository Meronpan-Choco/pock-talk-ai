import type {
    ISTTPort,
    STTStreamCallbacks,
    ISTTStreamHandle,
} from '@pocktalk/shared';

export class STTPort implements ISTTPort {
    startStream(callbacks: STTStreamCallbacks): ISTTStreamHandle {
        // TODO: 実際のSTTエンジンのストリーミングセッション開始処理は保留。
        return {
            pushAudioChunk: (chunk: Uint8Array) => {
                // TODO: 実際のエンジンへオーディオチャンクを流し込む処理
            },
            end: () => {
                // TODO: ストリーム終了処理。
                // とりあえずモックとして、ダミーの確定結果をコールバックで返す。
                callbacks.onFinalResult({
                    text: 'ダミーの音声認識結果です。',
                    isFinal: true,
                    spans: [],
                    aggregateConfidence: 0.9,
                });
            },
        };
    }
}