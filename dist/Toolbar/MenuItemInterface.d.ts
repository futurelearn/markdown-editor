import { MarkType, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export interface MenuItemInterface {
    name: string;
    icon: string;
    command: (state: EditorState, dispatch: EditorView['dispatch'], editor: EditorView) => any;
    type: MarkType | NodeType;
}
