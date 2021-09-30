import { NodeType } from 'prosemirror-model';
import BaseType from '../BaseType';
declare class Node extends BaseType {
    get type(): NodeType;
    protected get _type(): NodeType<import("prosemirror-model").Schema<any, any>>;
    get paragraphType(): NodeType<import("prosemirror-model").Schema<any, any>>;
    get listItemType(): NodeType<import("prosemirror-model").Schema<any, any>>;
}
export default Node;
