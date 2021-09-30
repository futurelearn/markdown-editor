import { CreateEditorViewOptions } from '../types';
import { EditorView } from 'prosemirror-view';
declare const createEditorView: ({ node, value, onChange, classes, placeholder, onToolbarChange, imageUploadEndpoint, disabledMarks, disabledNodes, onError, }: CreateEditorViewOptions) => EditorView<any>;
export { createEditorView };
