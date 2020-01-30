import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

export const markdownLinkInputRule = function(
  regexp: RegExp,
  markType: MarkType
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const tr = state.tr.insertText(match[1], start, end);
    const mark = markType.create({ href: match[2], title: match[3] });
    return tr.addMark(start, start + match[1].length, mark);
  });
};
