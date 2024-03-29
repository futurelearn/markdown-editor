import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleList } from '../utils';
import Node from './Node';

class BulletList extends Node {
  get name() {
    return 'bullet_list';
  }

  get label() {
    return 'Toggle bullet list';
  }

  get icon() {
    return 'UnorderedList';
  }

  get command() {
    return toggleList(this.type, this.listItemType);
  }

  get rules() {
    return [wrappingInputRule(/^\s*([-+*])\s$/, this.type)];
  }
}

export default BulletList;
