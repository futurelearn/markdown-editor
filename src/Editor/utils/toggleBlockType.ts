import { setBlockType } from 'prosemirror-commands';
import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { nodeIsActive } from './nodeIsActive';

export const toggleBlockType = function(
  type: NodeType,
  toggletype: NodeType,
  attrs = {}
) {
  return (state: EditorState, dispatch: EditorView['dispatch']) => {
    const { isActive } = nodeIsActive(state, type, attrs);

    if (isActive) {
      return setBlockType(toggletype)(state, dispatch);
    }

    return setBlockType(type, attrs)(state, dispatch);
  };
};
