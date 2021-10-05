import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare const toggleBlockType: (type: NodeType, toggletype: NodeType) => (state: EditorState, dispatch: EditorView['dispatch']) => boolean;
