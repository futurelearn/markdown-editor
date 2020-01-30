import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
export declare const toggleList: (listType: NodeType<any>, itemType: NodeType<any>) => (state: EditorState<any>, dispatch: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
