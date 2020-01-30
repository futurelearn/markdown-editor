import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
export declare const toggleWrap: (type: NodeType<any>) => (state: EditorState<any>, dispatch: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
