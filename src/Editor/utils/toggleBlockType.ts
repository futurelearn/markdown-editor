import { setBlockType, exitCode } from 'prosemirror-commands';
import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { nodeIsActive } from './nodeIsActive';
import { schema } from '../markdown';

export const toggleBlockType = function(
  type: NodeType,
  toggletype: NodeType,
  attrs = {}
) {
  return (state: EditorState, dispatch: EditorView['dispatch']) => {
    const { isActive, node } = nodeIsActive(state, type, attrs);

    if (isActive) {
      if (type === schema.nodes.code_block && node?.textContent.length) {
        return exitCode(state, dispatch);
      }
      return setBlockType(toggletype)(state, dispatch);
    }

    return setBlockType(type, attrs)(state, dispatch);
  };
};
