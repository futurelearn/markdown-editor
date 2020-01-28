import { MarkType } from 'prosemirror-model';
import BaseType from '../BaseType';

class Mark extends BaseType {
  get schemaSupportsMark() {
    return this.schema.marks[this.name];
  }

  get type() {
    if (this.schemaSupportsMark) {
      return this.schema.marks[this.name];
    }

    return null;
  }

  protected get _type() {
    return this.type as MarkType;
  }
}

export default Mark;
