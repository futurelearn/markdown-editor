import { Schema, MarkType, NodeType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { inputRules, InputRule } from 'prosemirror-inputrules';

class BaseType {
  schema: Schema;
  constructor(schema: Schema) {
    this.schema = schema;
  }

  get name() {
    return '';
  }

  get label() {
    return '';
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

  get type(): MarkType | NodeType | null {
    return this._type;
  }

  protected get _type(): MarkType | NodeType | null {
    return null;
  }

  getPlugins() {
    if (this._type) {
      return [keymap(this.shortcuts), inputRules({ rules: this.rules })];
    }

    return [];
  }

  getToolbarItem() {
    if (this._type && this.inToolbar && this.command) {
      return {
        name: this.name,
        icon: this.icon,
        command: this.command,
        type: this.type,
        label: this.label,
      };
    }

    return null;
  }
}

export default BaseType;
