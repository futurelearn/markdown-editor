import {
  schema as initialSchema,
  defaultMarkdownSerializer as initialDefaultMarkdownSerializer,
  defaultMarkdownParser as initialDefaultMarkdownParser,
} from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';
import { DefaultMarkdownParserWithTokenHandlersInterface } from './DefaultMarkdownParserWithTokenHandlersInterface';
import { omit } from 'lodash';

declare module 'prosemirror-markdown' {
  let schema: Schema;
}

const initialDefaultMarkdownParserWithTokenHandlers = initialDefaultMarkdownParser as DefaultMarkdownParserWithTokenHandlersInterface;

const IGNORED_NODES = ['horizontal_rule', 'hard_break'];
const IGNORED_TOKENS = ['hr', 'hardbreak'];
const DISABLED_RULES = ['hr'];

const schema = (() => {
  initialSchema.nodes = omit(initialSchema.nodes, IGNORED_NODES);
  //@ts-ignore
  initialSchema.nodes.code_block.isolating = true;
  return initialSchema;
})();
const defaultMarkdownParser = (() => {
  initialDefaultMarkdownParserWithTokenHandlers.tokens = omit(
    initialDefaultMarkdownParser.tokens,
    IGNORED_TOKENS
  );
  initialDefaultMarkdownParserWithTokenHandlers.tokenHandlers = omit(
    initialDefaultMarkdownParserWithTokenHandlers.tokenHandlers,
    IGNORED_TOKENS
  );
  initialDefaultMarkdownParserWithTokenHandlers.tokenizer.options.linkify = true;
  initialDefaultMarkdownParserWithTokenHandlers.tokenizer.disable(
    DISABLED_RULES
  );
  return initialDefaultMarkdownParser;
})();

const defaultMarkdownSerializer = (() => {
  initialDefaultMarkdownSerializer.nodes.code_block = (state, node) => {
    state.write('~~~' + (node.attrs.params || '') + '\n');
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('~~~');
    state.closeBlock(node);
  };
  return initialDefaultMarkdownSerializer;
})();

export { schema, defaultMarkdownParser, defaultMarkdownSerializer };
