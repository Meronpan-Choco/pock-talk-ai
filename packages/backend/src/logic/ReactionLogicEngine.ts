import type {
    EvaluateTurnInput,
    ReactionResult,
    IReactionLogicEngine,
} from '@pocktalk/shared';

export class ReactionLogicEngine implements IReactionLogicEngine {
    evaluate(input: EvaluateTurnInput): ReactionResult {
        // TODO: 4章「反応ロジック層」の本格的な実装 (LLM判定・ベクトル検索等) は保留。
        // 現状はインターフェースを満たすためのダミーの戻り値を返す。
        return {
        updatedChecklist: input.currentChecklist,
        reactionCategory: 'acknowledgment',
        strikeIntensity: null,
        eventFlags: [],
        };
    }
}