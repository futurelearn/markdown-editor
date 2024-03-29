import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleList } from '../utils';
import Node from './Node';

class OrderedList extends Node {
  get name() {
    return 'ordered_list';
  }

  get label() {
    return 'Toggle ordered list';
  }

  get icon() {
    return 'OrderedList';
  }

  get command() {
    return toggleList(this.type, this.listItemType);
  }

  get rules() {
    return [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        this.type,
        match => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order === +match[1]
      ),
    ];
  }
}

export default OrderedList;
