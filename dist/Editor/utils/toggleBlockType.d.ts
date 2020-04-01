import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
export declare const toggleBlockType: (type: NodeType<any>, toggletype: NodeType<any>, attrs?: {}) => (state: EditorState<any>, dispatch: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
