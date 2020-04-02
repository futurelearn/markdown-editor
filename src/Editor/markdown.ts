import {
  defaultMarkdownParser as initialDefaultMarkdownParser,
  defaultMarkdownSerializer as initialDefaultMarkdownSerializer,
  MarkdownParser,
} from 'prosemirror-markdown';
//@ts-ignore
import initialSchema from './schema';
import { Schema, Mark } from 'prosemirror-model';
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
};

const setupSchema = ({
  disabledMarks = [],
  disabledNodes = [],
}: {
  disabledMarks?: string[];
  disabledNodes?: string[];
}) => {
  if (disabledNodes.includes('code_block')) {
    disabledNodes.push('fence');
  }

  initialSchema.nodes = omit(initialSchema.nodes, [
    ...IGNORED_NODES,
    ...disabledNodes,
  ]);
  initialSchema.marks = omit(initialSchema.marks, disabledMarks);

  initialSchema.disabledNodes = disabledNodes;
  initialSchema.disabledMarks = disabledMarks;

  return initialSchema;
};

const defaultMarkdownParser = (schema: MarkdownSchema) => {
  const disabledTokens = [
    ...IGNORED_TOKENS,
    ...schema.disabledNodes,
    ...schema.disabledMarks,
  ];
  const tokens = omit(initialDefaultMarkdownParser.tokens, disabledTokens);

  const md = markdownit('commonmark', { html: false });
  const tokensToDisable = compact(
    disabledTokens.map(t => MARKDOWN_IT_RULES[t])
  );
  md.disable(tokensToDisable);

  //@ts-ignore
  const parser =  new MarkdownParser(schema, md, tokens);
  parser.tokenHandlers.paragraph_close = (state: any) => {
    if (state.marks.length) { state.marks = Mark.none; }
    const info = state.stack.pop();
    const node = info.type.create(info.attrs, info.content, state.marks);
    state.push(node);
    return node;
  }

  return parser;
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
