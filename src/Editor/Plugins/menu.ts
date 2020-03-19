import { MenuItem } from '../../types';
import { MarkType, NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { nodeIsActive, markIsActive } from '../utils';

class Menu {
  items: MenuItem[];
  editorView: EditorView;
  onUpdate: (items: string[]) => any;

  constructor(
    items: MenuItem[],
    editorView: EditorView,
    onUpdate: (items: string[]) => any
  ) {
    this.items = items;
    this.editorView = editorView;
    this.onUpdate = onUpdate;
  }

  markActive(type: MarkType | NodeType): boolean {
    const { state } = this.editorView;

    if (type instanceof NodeType) {
      return nodeIsActive(state, type).isActive;
    }

    return markIsActive(state, type);
  }

  update() {
    const activeItems = this.items.filter(item => this.markActive(item.type));
    if (activeItems.length) {
      this.onUpdate(activeItems.map(i => i.name));
    } else {
      this.onUpdate([]);
    }
  }

  destroy() {
    this.onUpdate([]);
  }
}

export const menuPlugin = (
  items: MenuItem[],
  onUpdate: (items: string[]) => any
) =>
  new Plugin({
    view: editorView => new Menu(items, editorView, onUpdate),
  });
