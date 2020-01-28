import { Schema, NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { inputRules, InputRule } from 'prosemirror-inputrules';

class Node {
  schema: Schema;
  constructor(schema: Schema) {
    this.schema = schema;
  }

  get schemaSupportsNode() {
    return this.schema.nodes[this.name];
  }

  get name() {
    return '';
  }

  get type() {
    if (this.schemaSupportsNode) {
      return this.schema.nodes[this.name];
    }

    return null;
  }

  get _type() {
    return this.type as NodeType;
  }

  get paragraphType() {
    return this.schema.nodes.paragraph;
  }

  get listItemType() {
    return this.schema.nodes.list_item;
  }

  get icon() {
    return '';
  }

  get inToolbar() {
    return true;
  }

  get command() {
    return (_state: any, _dispatch: any) => {};
  }

  get shortcuts() {
    return {};
  }

  get rules() {
    return [] as InputRule[];
  }

  getPlugins() {
    if (this.type) {
      return [keymap(this.shortcuts), inputRules({ rules: this.rules })];
    }

    return [];
  }

  getToolbarItem() {
    if (this.type && this.inToolbar && this.command) {
      return {
        name: this.name,
        icon: this.icon,
        command: this.command,
        type: this.type,
      }
    }

    return null;
  }
}

export default Node;
