import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

let editor = new EditorView({
  extensions: [vscodeDark, basicSetup, python()],
  parent: document.body
});