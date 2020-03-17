import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownEditor from '../.';
import '../dist/markdown-editor.cjs.production.min.css';

const App = () => {
  const [errors, setErrors] = React.useState('');
  return (
    <div>
      <MarkdownEditor
        id="editor"
        name="editor"
        onError={setErrors}
        disabledMarks={['code', 'link']}
        disabledNodes={[
          'heading',
          'blockquote',
          'code_block',
          'bullet_list',
          'ordered_list',
          'image',
        ]}
      />
      {!!errors.length && <p>{errors}</p>}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
