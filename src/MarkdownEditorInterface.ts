export type OnChangeFn = (value: string) => any;

type DisabledNode = 'code' | 'link';
type DisabledMark =
  | 'heading'
  | 'blockquote'
  | 'code_block'
  | 'bullet_list'
  | 'ordered_list'
  | 'image';

export interface MarkdownEditorInterface {
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
}
