import { MarkType } from 'prosemirror-model';
import BaseType from '../BaseType';

class Mark extends BaseType {
  get type(): MarkType {
    return this._type as MarkType;
  }

  protected get _type() {
    return this.schema.marks[this.name];
  }
}

export default Mark;
