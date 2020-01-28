import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleList } from '../utils';
import Node from './Node';

class BulletList extends Node {
  get name() {
    return 'bullet_list';
  }

  get icon() {
    return 'UnorderedList';
  }

  get command() {
    return toggleList(this._type, this.listItemType);
  }

  get rule() {
    return [wrappingInputRule(/^\s*([-+*])\s$/, this._type)];
  }
}

export default BulletList;
