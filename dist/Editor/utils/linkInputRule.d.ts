import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
export declare const linkInputRule: (regexp: RegExp, markType: MarkType<any>) => InputRule<any>;
