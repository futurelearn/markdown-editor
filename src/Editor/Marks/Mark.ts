import { Schema, MarkType } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { inputRules, InputRule } from 'prosemirror-inputrules';

class Mark {
  schema: Schema;
  constructor(schema: Schema) {
    this.schema = schema;
  }

  get schemaSupportsMark() {
    return this.schema.marks[this.name];
  }

  get name() {
    return '';
  }

  get type() {
    if (this.schemaSupportsMark) {
      return this.schema.marks[this.name];
    }

    return null;
  }

  get _type() {
    return this.type as MarkType;
  }

  get icon() {
    return '';
  }

  get inToolbar() {
    return true;
  }

  get command() {
    return (_state: any) => {};
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

export default Mark;
