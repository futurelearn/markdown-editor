# The FutureLearn Markdown Editor

### What is it?

This is a rich text editor powered by [prosemirror](https://prosemirror.net/). It provides markdown shortcuts as well as a toolbar for producing rich text and produces a string of markdown as it's output.

It currently supports:

* Bold
* Italic
* Links
* Inline Code
* Code blocks with syntax highlighting
* Blockquotes
* Images
* Headings
* Unordered lists
* Ordered lists

### Developing

To start developing run `npm run start` which will start compiling the assets in watch mode. `cd` in example and run `npm install` to install the dependencies of the example app which the test suite will be run again. To run the test suite then run `npm run test` which will start up the example app and cypress.

To view the editor you can visit `http://localhost:1234`.

### Supporting new elements

The markdown renderer relies on [markdown-it](https://github.com/markdown-it/markdown-it). Therefore, as it is currently configured, we can only render elements that markdown-it knows about. However, using it's plugin system it should be possible to add our own custom markdown elements. We instanciate the markdown parser [here](https://github.com/futurelearn/markdown-editor/blob/master/src/Editor/markdown.ts#L68) so any customisations to it should be applied at this level to ensure that they get provided to all the plugins as well as the editor as a whole.

Prosemirror relies on it's [schema](https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/schema.js) for the elements that it supports, so if we wanted to add new elements to it we'd need to customise the schema. You can find an example [here](https://prosemirror.net/examples/dino/) of adding custom elements to the schema.

When adding a new element, you need to add an icon (if it's going to be present in the toolbar) and then define a class for the node or mark that looks something like [this](https://github.com/futurelearn/markdown-editor/blob/master/src/Editor/Marks/Strong.ts). If you then add it to the [elements here](https://github.com/futurelearn/markdown-editor/blob/master/src/Editor/Marks/index.ts#L8) then the editor and the toolbar will both know about it.
