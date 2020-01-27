import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { NodeType, Node } from 'prosemirror-model';

export const nodeIsActive = function(
  state: EditorState,
  type: NodeType,
  attrs = {}
) {
  const predicate = (node: Node) => node.type === type;
  const node =
    findSelectedNodeOfType(type)(state.selection) ||
    findParentNode(predicate)(state.selection);

  if (!Object.keys(attrs).length || !node) {
    return {
      isActive: !!node,
      node: node?.node,
    }
  }

  return {
    isActive: node.node.hasMarkup(type, attrs),
    node: node.node,
  };
};
