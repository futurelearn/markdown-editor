import Node from './Node';
declare class OrderedList extends Node {
    get name(): string;
    get label(): string;
    get icon(): string;
    get command(): (state: import("prosemirror-state").EditorState<any>, dispatch: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    get rules(): import("prosemirror-inputrules").InputRule<any>[];
}
export default OrderedList;
