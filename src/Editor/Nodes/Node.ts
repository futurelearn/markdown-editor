import { NodeType } from 'prosemirror-model';
import BaseType from '../BaseType';

class Node extends BaseType {
  get schemaSupportsNode() {
    return this.schema.nodes[this.name];
  }

  get type() {
    if (this.schemaSupportsNode) {
      return this.schema.nodes[this.name];
    }

    return null;
  }

  protected get _type() {
    return this.type as NodeType;
  }

  get paragraphType() {
    return this.schema.nodes.paragraph;
  }

  get listItemType() {
    return this.schema.nodes.list_item;
  }
}

export default Node;
