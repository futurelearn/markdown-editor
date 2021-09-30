import { EditorState } from 'prosemirror-state';
import { NodeType, Node } from 'prosemirror-model';
export declare const nodeIsActive: (state: EditorState<any>, type: NodeType<any>) => {
    isActive: boolean;
    node: Node<any> | undefined;
};
