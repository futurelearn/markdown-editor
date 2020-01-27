import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownEditor from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MarkdownEditor name="editor" id="editor" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
