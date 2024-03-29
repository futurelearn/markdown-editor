import { CreateEditorViewOptions } from '../types';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  setupSchema,
} from './markdown';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, exitCode, setBlockType } from 'prosemirror-commands';
import { history, undo, redo } from 'prosemirror-history';
import { splitListItem } from 'prosemirror-schema-list';
import {
  editorPlugin,
  pastePlugin,
  menuPlugin,
  imageDropPlugin,
  placeholderPlugin,
  highlightPlugin,
} from './Plugins';
import toolbarItems from '../Toolbar/menuItems';
import { plugins as markPlugins } from './Marks';
import { plugins as nodePlugins } from './Nodes';

const createEditorView = ({
  node,
  value,
  onChange,
  classes,
  placeholder,
  onToolbarChange,
  imageUploadEndpoint,
  disabledMarks,
  disabledNodes,
  onError,
}: CreateEditorViewOptions): EditorView => {
  const schema = setupSchema({ disabledMarks, disabledNodes });
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
    pastePlugin(schema, onError),
    menuPlugin(toolbarItems(schema), onToolbarChange),
    ...markPlugins(schema),
    ...nodePlugins(schema),
    editorPlugin(classes, placeholder),
  ];

  schema.nodes.code_block &&
    plugins.push(highlightPlugin({ name: schema.nodes.code_block.name }));

  imageUploadEndpoint &&
    schema.nodes.image &&
    plugins.push(
      placeholderPlugin,
      imageDropPlugin(imageUploadEndpoint, onError)
    );

  const editorView = new EditorView(node, {
    state: EditorState.create({
      schema,
      doc: defaultMarkdownParser(schema).parse(value),
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
