import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { NodeType, Node } from 'prosemirror-model';

export const nodeIsActive = function(state: EditorState, type: NodeType) {
  const predicate = (node: Node) => node.type === type;
  const node =
    findSelectedNodeOfType(type)(state.selection) ||
    findParentNode(predicate)(state.selection);

  return {
    isActive: !!node,
    node: node?.node,
  };
};
