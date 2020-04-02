import { Schema } from 'prosemirror-model';
export interface MarkdownSchema extends Schema {
    disabledNodes: string[];
    disabledMarks: string[];
}
declare module 'prosemirror-markdown' {
    let schema: MarkdownSchema;
}
declare const setupSchema: ({ disabledMarks, disabledNodes, }: {
    disabledMarks?: string[] | undefined;
    disabledNodes?: string[] | undefined;
}) => any;
declare const defaultMarkdownParser: (schema: MarkdownSchema) => any;
declare const defaultMarkdownSerializer: import("prosemirror-markdown").MarkdownSerializer<any>;
export { setupSchema, defaultMarkdownParser, defaultMarkdownSerializer };
