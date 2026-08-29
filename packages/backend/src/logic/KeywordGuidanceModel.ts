import type {
    SelectTargetInput,
    GuidanceResult,
    IKeywordGuidanceModel,
} from '@pocktalk/shared';

export class KeywordGuidanceModel implements IKeywordGuidanceModel {
    selectTarget(input: SelectTargetInput): GuidanceResult {
        // TODO: 6章「キーワード誘導モデル」の本格的な実装は保留。
        // 現状はターゲットキーワードなし（null）を返す。
        return {
        targetKeywordId: null,
        hintText: null,
        };
    }
}