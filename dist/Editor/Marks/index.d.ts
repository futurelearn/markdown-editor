import { Schema } from 'prosemirror-model';
export declare const plugins: (schema: Schema) => import("prosemirror-state").Plugin<any, any>[];
export declare const toolbarItems: (schema: Schema) => {
    name: string;
    icon: string;
    command: (_state: any, _dispatch: any) => void;
    type: import("prosemirror-model").MarkType<any> | import("prosemirror-model").NodeType<any> | null;
    label: string;
}[];
