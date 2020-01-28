export type OnChangeFn = (value: string) => any;

export interface MarkdownEditorInterface {
  id: string;
  name: string;
  onChange?: OnChangeFn;
  value?: string;
  placeholder?: string;
  classes?: string;
  rows?: number;
  imageUploadEndpoint?: { url: string, csrfToken: string };
  onError?: any;
  disabledNodes?: ('code' | 'link')[];
  disabledMarks?: ('heading' | 'blockquote' | 'code_block' | 'bullet_list' | 'ordered_list' | 'image')[];
}
