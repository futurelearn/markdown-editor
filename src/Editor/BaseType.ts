import { Schema } from 'prosemirror-model';
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
      };
    }

    return null;
  }
}

export default BaseType;
