import type {
    ITTSPort,
    SynthesizeInput,
} from '@pocktalk/shared';

export class TTSPort implements ITTSPort {
    async synthesize(
        input: SynthesizeInput,
        onAudioChunk: (chunk: Uint8Array) => void
    ): Promise<void> {
        // TODO: 実際のTTSエンジンの音声合成処理は保留。
        // モックとして空のバイナリデータ（無音）を1回だけ返す。
        onAudioChunk(new Uint8Array(0));
    }

    cancel(turnId: number): void {
        // TODO: バージイン発生時など、進行中の合成ジョブをキャンセルする処理 (8.3節)
    }

    getCachedPhrase(phraseId: string): Uint8Array | null {
        // TODO: 定型相槌の事前合成キャッシュ取得処理 (8.4節)
        return null;
    }
}