import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownEditor from '../dist';
import '../dist/markdown-editor.cjs.production.min.css';

const App = () => {
  const [errors, setErrors] = React.useState('');
  return (
    <div>
      <MarkdownEditor
        id="editor"
        name="editor"
        onError={setErrors}
        value="![](https://staging-ugc.futurelearn.com/uploads/images/fd/17/200w_d.gif)"
      />
      {!!errors.length && <p>{errors}</p>}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
