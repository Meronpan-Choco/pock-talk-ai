import type {
    IFillerController,
    FillerDecisionInput,
    FillerTone,
} from '@pocktalk/shared';

export class FillerController implements IFillerController {
    shouldTrigger(input: FillerDecisionInput): boolean {
        // TODO: 合成遅延時のフィラー音声先行再生ロジックは保留 (8.5節)。
        // 現在は常に再生しない(false)ものとする。
        return false;
    }

    selectTone(hasEarlyContradictionSignal: boolean): FillerTone {
        // TODO: トーン選択。とりあえず矛盾の兆候があれば'hesitant'、なければ'thinking'とする。
        return hasEarlyContradictionSignal ? 'hesitant' : 'thinking';
    }
}