import { InputRule } from 'prosemirror-inputrules';
import { MarkType, Mark } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

interface MarkBetweenInterface {
  start: number;
  end: number;
  mark: Mark;
}

const getMarksBetween = (start: number, end: number, state: EditorState) => {
  let marks: MarkBetweenInterface[] = [];

  state.doc.nodesBetween(start, end, (node, pos) => {
    marks = [
      ...marks,
      ...node.marks.map(mark => ({
        start: pos,
        end: pos + node.nodeSize,
        mark,
      })),
    ];
  });

  return marks;
};

export const markInputRule = function(
  regexp: RegExp,
  markType: MarkType,
  getAttrs?: any
): InputRule {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const { tr } = state;
    const m = match.length - 1;
    let markEnd = end;
    let markStart = start;

    if (match[m]) {
      const matchStart = start + match[0].indexOf(match[m - 1]);
      const matchEnd = matchStart + match[m - 1].length - 1;
      const textStart = matchStart + match[m - 1].lastIndexOf(match[m]);
      const textEnd = textStart + match[m].length;

      const excludedMarks = getMarksBetween(start, end, state)
        .filter(item => item.mark.type.excludes(markType))
        .filter(item => item.end > matchStart);

      if (excludedMarks.length) {
        return null;
      }

      if (textEnd < matchEnd) {
        tr.delete(textEnd, matchEnd);
      }
      if (textStart > matchStart) {
        tr.delete(matchStart, textStart);
      }
      markStart = matchStart;
      markEnd = markStart + match[m].length;
    }

    tr.addMark(markStart, markEnd, markType.create(attrs));
    tr.removeStoredMark(markType);
    return tr;
  });
};
