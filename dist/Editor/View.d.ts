import { CreateEditorViewOptionsInterface } from './CreateEditorViewOptionsInterface';
import { EditorView } from 'prosemirror-view';
declare const createEditorView: ({ node, value, onChange, classes, placeholder, onToolbarChange, imageUploadEndpoint, disabledMarks, disabledNodes, onError, }: CreateEditorViewOptionsInterface) => EditorView<any>;
export { createEditorView };
