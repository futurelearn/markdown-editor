import Mark from './Mark';
declare class Strong extends Mark {
    get name(): string;
    get label(): string;
    get icon(): string;
    get command(): (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    get shortcuts(): {
        'Mod-b': (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
        'Mod-B': (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    };
    get rules(): import("prosemirror-inputrules").InputRule<any>[];
}
export default Strong;
