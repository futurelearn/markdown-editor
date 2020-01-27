import { MarkdownParser } from 'prosemirror-markdown';

export interface DefaultMarkdownParserWithTokenHandlersInterface
  extends MarkdownParser {
  tokenHandlers: (string | undefined)[];
  tokenizer: {
    options: {
      linkify: boolean;
    };
    disable: (rules: string[]) => any;
  };
}
