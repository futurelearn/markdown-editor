import { Plugin } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
export declare const placeholderPlugin: Plugin<DecorationSet<any>, any>;
export declare const findPlaceholder: (state: EditorState<any>, id: {}) => number | null;
