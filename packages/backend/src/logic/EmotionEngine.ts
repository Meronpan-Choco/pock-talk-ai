import type {
    UpdateEmotionInput,
    EmotionResult,
    IEmotionEngine,
} from '@pocktalk/shared';

export class EmotionEngine implements IEmotionEngine {
    update(input: UpdateEmotionInput): EmotionResult {
        // TODO: 5章「感情表出層」の状態更新方程式の実装は保留。
        // 現状は入力された感情をそのまま返し、confusionLevelを0とする。
        return {
        updatedEmotion: input.currentEmotion,
        confusionLevel: 0,
        };
    }
}