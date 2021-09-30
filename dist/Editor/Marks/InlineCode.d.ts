import Mark from './Mark';
declare class InlineCode extends Mark {
    get name(): string;
    get label(): string;
    get icon(): string;
    get shortcuts(): {
        'Mod-`': (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    };
    get rules(): import("prosemirror-inputrules").InputRule<any>[];
    get command(): (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
}
export default InlineCode;
