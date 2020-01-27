import { Plugin } from 'prosemirror-state';

export const editorPlugin = (classes: string, placeholder: string) => new Plugin({
  props: {
    attributes: {
      class: classes,
      'data-placeholder': placeholder,
    },
  },
});
