import type {
    IResponseGenerator,
    GenerateResponseInput,
    ResponseSentenceChunk,
} from '@pocktalk/shared';

export class ResponseGenerator implements IResponseGenerator {
    async generate(
        input: GenerateResponseInput,
        onSentence: (chunk: ResponseSentenceChunk) => void
    ): Promise<void> {
        // TODO: LLM等を用いた応答テキストのストリーミング生成処理は保留。
        // モックとしてダミーの1文だけをコールバックで返す。
        onSentence({
            turnId: input.turnId,
            sentenceIndex: 0,
            text: 'はい、ダミーのAI応答です。',
        });
    }

    abort(turnId: number): void {
        // TODO: バージイン発生時など、未生成の後続文の生成をキャンセルする処理 (8.3節)
    }
}