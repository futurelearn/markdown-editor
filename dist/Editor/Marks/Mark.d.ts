import { MarkType } from 'prosemirror-model';
import BaseType from '../BaseType';
declare class Mark extends BaseType {
    get type(): MarkType;
    protected get _type(): MarkType<import("prosemirror-model").Schema<any, any>>;
}
export default Mark;
