import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
export declare const toggleList: (listType: NodeType, itemType: NodeType) => (state: EditorState, dispatch: EditorView['dispatch']) => boolean;
