import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleList } from '../utils';
import Node from './Node';

class OrderedList extends Node {
  get name() {
    return 'ordered_list';
  }

  get icon() {
    return 'OrderedList';
  }

  get command() {
    return toggleList(this._type, this.listItemType);
  }

  get rules() {
    return [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        this._type,
        match => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order === +match[1]
      ),
    ];
  }
}

export default OrderedList;
