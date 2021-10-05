import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare const toggleWrap: (type: NodeType) => (state: EditorState, dispatch: EditorView['dispatch']) => boolean;
