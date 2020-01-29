import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';

export const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(this: Plugin, tr, set: DecorationSet) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      let action = tr.getMeta(this);
      if (action && action.add) {
        let widget = document.createElement('div');
        widget.className = 'image__placeholder';
        let loader = document.createElement('div');
        loader.className = 'loader';
        widget.appendChild(loader);
        let deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id,
        });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(
          set.find(undefined, undefined, spec => spec.id === action.remove.id)
        );
      }
      return set;
    },
  },
  props: {
    decorations(this: Plugin, state) {
      return this.getState(state);
    },
  },
});

export const findPlaceholder = function(state: EditorState, id: {}) {
  let decos = placeholderPlugin.getState(state);
  let found = decos.find(undefined, undefined, spec => spec.id === id);
  return found.length ? found[0].from : null;
};
