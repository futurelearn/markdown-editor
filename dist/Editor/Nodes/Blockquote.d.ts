import Node from './Node';
declare class Blockquote extends Node {
    get name(): string;
    get icon(): string;
    get command(): (state: import("prosemirror-state").EditorState<any>, dispatch: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    get rules(): import("prosemirror-inputrules").InputRule<any>[];
}
export default Blockquote;
