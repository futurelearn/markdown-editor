import { NodeType } from 'prosemirror-model';
import BaseType from '../BaseType';

class Node extends BaseType {
  get type(): NodeType {
    return this._type as NodeType;
  }

  protected get _type() {
    return this.schema.nodes[this.name];
  }

  get paragraphType() {
    return this.schema.nodes.paragraph;
  }

  get listItemType() {
    return this.schema.nodes.list_item;
  }
}

export default Node;
