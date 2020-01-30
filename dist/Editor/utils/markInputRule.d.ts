import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
export declare const markInputRule: (regexp: RegExp, markType: MarkType<any>, getAttrs?: any) => InputRule<any>;
