import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
export declare const markdownLinkInputRule: (regexp: RegExp, markType: MarkType<any>) => InputRule<any>;
