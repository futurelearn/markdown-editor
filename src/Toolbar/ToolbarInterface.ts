import { MenuItemInterface } from './MenuItemInterface';
import { EditorView } from 'prosemirror-view';

export interface ToolbarInterface {
  onClick: (option: MenuItemInterface) => any;
  activeOptions: string[];
  imageUploadEndpoint?: { url: string; csrfToken: string };
  editor: EditorView;
  onError?: any;
  disabledItems: string[];
}
