import { OnChangeFn } from '../MarkdownEditorInterface';

export interface CreateEditorViewOptionsInterface {
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
}
