import { Schema, MarkType, NodeType } from 'prosemirror-model';
import { InputRule } from 'prosemirror-inputrules';
declare class BaseType {
    schema: Schema;
    constructor(schema: Schema);
    get name(): string;
    get icon(): string;
    get inToolbar(): boolean;
    get command(): (_state: any, _dispatch: any) => void;
    get shortcuts(): {};
    get rules(): InputRule<any>[];
    get type(): MarkType | NodeType | null;
    protected get _type(): MarkType | NodeType | null;
    getPlugins(): import("prosemirror-state").Plugin<any, any>[];
    getToolbarItem(): {
        name: string;
        icon: string;
        command: (_state: any, _dispatch: any) => void;
        type: MarkType<any> | NodeType<any> | null;
    } | null;
}
export default BaseType;
