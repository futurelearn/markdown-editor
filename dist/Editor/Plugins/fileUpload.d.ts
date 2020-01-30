import { EditorView } from 'prosemirror-view';
export declare const fileUpload: (view: EditorView<any>, images: File[], endpoint: {
    url: string;
    csrfToken: string;
}, position: number, onError: (errors: string) => any) => boolean;
