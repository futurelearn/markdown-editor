import { Plugin } from 'prosemirror-state';

const EDITOR_CLASS = 'rich-text-editor';

export const editorPlugin = (classes: string, placeholder: string) =>
  new Plugin({
    props: {
      attributes: {
        class: classes.length ? `${EDITOR_CLASS} ${classes}` : EDITOR_CLASS,
        'data-placeholder': placeholder,
      },
    },
  });
