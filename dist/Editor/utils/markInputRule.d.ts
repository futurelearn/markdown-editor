import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
export declare const markInputRule: (regexp: RegExp, markType: MarkType, getAttrs?: any) => InputRule;
