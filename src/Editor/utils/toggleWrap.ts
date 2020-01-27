import { wrapIn, lift } from 'prosemirror-commands';
import { NodeType } from 'prosemirror-model';
import { nodeIsActive } from './nodeIsActive';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export const toggleWrap = function(type: NodeType) {
  return (state: EditorState, dispatch: EditorView['dispatch']) => {
    const { isActive } = nodeIsActive(state, type);

    if (isActive) {
      return lift(state, dispatch);
    }

    return wrapIn(type)(state, dispatch);
  };
};
