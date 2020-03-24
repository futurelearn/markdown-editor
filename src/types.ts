import { FunctionComponent } from 'react';
import { MarkType, NodeType, Mark } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export type Icons = {
  [icon: string]: FunctionComponent;
};

export type OnChangeFn = (value: string) => any;

type DisabledNode = 'code' | 'link';
type DisabledMark =
  | 'heading'
  | 'blockquote'
  | 'code_block'
  | 'bullet_list'
  | 'ordered_list'
  | 'image';

export type MarkDownEditor = {
  id: string;
  name: string;
  onChange?: OnChangeFn;
  value?: string;
  placeholder?: string;
  classes?: string;
  rows?: number;
  imageUploadEndpoint?: { url: string; csrfToken: string };
  onError?: any;
  disabledNodes?: DisabledNode[];
  disabledMarks?: DisabledMark[];
  inputRef?: React.MutableRefObject<EditorView | null>;
};

export type MenuItem = {
  name: string;
  icon: string;
  command: (
    state: EditorState,
    dispatch: EditorView['dispatch'],
    editor: EditorView
  ) => any;
  type: MarkType | NodeType;
};

export type Toolbar = {
  onClick: (option: MenuItem) => any;
  activeOptions: string[];
  imageUploadEndpoint?: { url: string; csrfToken: string };
  editor: EditorView;
  onError?: any;
  disabledItems: string[];
};

export type ToolbarItem = {
  item: MenuItem;
  isActive: boolean;
  onClick: (option: MenuItem) => any;
};

export type CreateEditorViewOptions = {
  node: HTMLElement;
  value: string;
  onChange: OnChangeFn;
  placeholder: string;
  classes: string;
  onToolbarChange: (icons: string[]) => any;
  onError: (errors: string) => any;
  imageUploadEndpoint?: { url: string; csrfToken: string };
  disabledNodes: string[];
  disabledMarks: string[];
};

export type ContextualHelp = {
  activeOptions: string[];
};

export type Language = {
  language: string;
  pos: number;
  type: NodeType;
};

export type MarkBetween = {
  start: number;
  end: number;
  mark: Mark;
};
