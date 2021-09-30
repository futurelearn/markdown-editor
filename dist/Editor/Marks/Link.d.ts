import Mark from './Mark';
declare class Link extends Mark {
    get name(): string;
    get rules(): import("prosemirror-inputrules").InputRule<any>[];
    get inToolbar(): boolean;
}
export default Link;
