import { EditorView } from 'prosemirror-view';
import { ImageUploadEndpoint } from 'types';
export declare const fileUpload: (view: EditorView, images: File[], endpoint: ImageUploadEndpoint, position: number, onError: (errors: string) => any) => boolean;
