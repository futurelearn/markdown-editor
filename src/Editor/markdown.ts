import {
  schema as initialSchema,
  defaultMarkdownParser as initialDefaultMarkdownParser,
  defaultMarkdownSerializer as initialDefaultMarkdownSerializer,
  MarkdownParser,
} from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';
import { omit, compact } from 'lodash';
import markdownit from 'markdown-it/lib';

export interface MarkdownSchema extends Schema {
  disabledNodes: string[];
  disabledMarks: string[];
}

declare module 'prosemirror-markdown' {
  let schema: MarkdownSchema;
}

const IGNORED_NODES = ['horizontal_rule', 'hard_break'];
const IGNORED_TOKENS = ['hr', 'hardbreak'];
const MARKDOWN_IT_RULES: { [token: string]: string } = {
  code: 'backticks',
  heading: 'heading',
  blockquote: 'blockquote',
  code_block: 'code',
  fence: 'fence',
  bullet_list: 'list',
  ordered_list: 'list',
  hr: 'hr',
  image: 'image',
  link: 'link',
}

const setupSchema = ({ disabledMarks = [], disabledNodes = [] }: { disabledMarks?: string[], disabledNodes?: string[] }) => {
  if (disabledNodes.includes('code_block')) {
    disabledNodes.push('fence');
  } else {
    //@ts-ignore
    initialSchema.nodes.code_block.isolating = true;
  }

  initialSchema.nodes = omit(initialSchema.nodes, [...IGNORED_NODES, ...disabledNodes]);
  initialSchema.marks = omit(initialSchema.marks, disabledMarks);

  initialSchema.disabledNodes = disabledNodes;
  initialSchema.disabledMarks = disabledMarks;
  return initialSchema;
};

const defaultMarkdownParser = (schema: MarkdownSchema) => {
  const disabledTokens = [...IGNORED_TOKENS, ...schema.disabledNodes, ...schema.disabledMarks];
  const tokens = omit(initialDefaultMarkdownParser.tokens, disabledTokens);

  const md = markdownit('commonmark', { html: false });
  const tokensToDisable = compact(disabledTokens.map(t => MARKDOWN_IT_RULES[t]));
  md.disable(tokensToDisable);

  //@ts-ignore
  return new MarkdownParser(schema, md, tokens);
};

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

export { setupSchema, defaultMarkdownParser, defaultMarkdownSerializer };
