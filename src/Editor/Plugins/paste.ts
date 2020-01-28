import { Plugin } from 'prosemirror-state';
import { Slice } from 'prosemirror-model';
import { defaultMarkdownParser } from '../markdown';
import  { Schema } from 'prosemirror-model';

export const pastePlugin = (schema: Schema, onError: (errors: string) => any) =>
  new Plugin({
    props: {
      clipboardTextParser: text => {
        const fragment = defaultMarkdownParser(schema).parse(text).content;
        console.log(defaultMarkdownParser(schema));
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
