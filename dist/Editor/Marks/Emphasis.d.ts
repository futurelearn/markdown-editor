import Mark from './Mark';
declare class Emphasis extends Mark {
    get name(): string;
    get icon(): string;
    get shortcuts(): {
        'Mod-i': (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
        'Mod-I': (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    };
    get rules(): import("prosemirror-inputrules").InputRule<any>[];
    get command(): (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
}
export default Emphasis;
