import { CreateEditorViewOptionsInterface } from './CreateEditorViewOptionsInterface';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  schema,
} from './markdown';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, exitCode, setBlockType } from 'prosemirror-commands';
import { history, undo, redo } from 'prosemirror-history';
import { splitListItem } from 'prosemirror-schema-list';
import {
  pastePlugin,
  menuPlugin,
  imageDropPlugin,
  placeholderPlugin,
  editorPlugin,
  highlightPlugin,
} from './Plugins';
import toolbarItems from '../Toolbar/menuItems';
import MarkPlugins from './Marks';
import NodePlugins from './Nodes';

const LIST_ITEM_TYPE = schema.nodes.list_item;

const toggleBlockIfEmpty = (
  state: EditorState,
  dispatch: EditorView['dispatch']
) => {
  let {
    $from: { parent },
  } = state.selection;
  if ([schema.nodes.heading, schema.nodes.code_block].includes(parent.type)) {
    if (!parent.textContent.length) {
      setBlockType(schema.nodes.paragraph)(state, dispatch);
      return true;
    }
  }

  return false;
};

const createEditorView = ({
  node,
  value,
  onChange,
  classes,
  placeholder,
  onToolbarChange,
  imageUploadEndpoint,
  onError,
}: CreateEditorViewOptionsInterface): EditorView => {
  const plugins = [
    history(),
    keymap({
      'Mod-z': undo,
      'Mod-y': redo,
      Enter: splitListItem(LIST_ITEM_TYPE),
      Backspace: toggleBlockIfEmpty,
    }),
    keymap({
      'Shift-Enter': exitCode,
    }),
    keymap(baseKeymap),
    pastePlugin(onError),
    menuPlugin(toolbarItems, onToolbarChange),
    ...NodePlugins,
    ...MarkPlugins,
    editorPlugin(classes, placeholder),
    highlightPlugin({ name: schema.nodes.code_block.name }),
  ];

  imageUploadEndpoint &&
    plugins.push(placeholderPlugin, imageDropPlugin(imageUploadEndpoint, onError));

  const editorView = new EditorView(node, {
    state: EditorState.create({
      schema,
      doc: defaultMarkdownParser.parse(value),
      plugins,
    }),
    dispatchTransaction(transation: Transaction) {
      const newState = editorView.state.apply(transation);
      editorView.updateState(newState);
      onChange(defaultMarkdownSerializer.serialize(editorView.state.doc));
    },
  });

  return editorView;
};

export { createEditorView };
