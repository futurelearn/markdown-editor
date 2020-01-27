import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

export const linkInputRule = function(regexp: RegExp, markType: MarkType) {
  return new InputRule(regexp, (state, match, start, end) => {
    const tr = state.tr.insertText(match[0], start, end);
    const mark = markType.create({ href: match[1] });
    return tr.addMark(start, start + match[1].length, mark);
  });
};
