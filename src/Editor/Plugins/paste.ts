import { Plugin } from 'prosemirror-state';
import { Slice } from 'prosemirror-model';
import { defaultMarkdownParser } from 'prosemirror-markdown';

export const pastePlugin = (onError: (errors: string) => any) =>
  new Plugin({
    props: {
      clipboardTextParser: text => {
        const fragment = defaultMarkdownParser.parse(text).content;
        return Slice.maxOpen(fragment);
      },
      transformPastedHTML: html => {
        if (html.includes('<img src')) {
          onError('Pasted content cannot contain images');
          return '';
        }

        return html;
      },
    },
  });
