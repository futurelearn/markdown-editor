import { EditorState } from 'prosemirror-state';
import { NodeType, Node } from 'prosemirror-model';
export declare const nodeIsActive: (state: EditorState, type: NodeType) => {
    isActive: boolean;
    node: Node<any> | undefined;
};
