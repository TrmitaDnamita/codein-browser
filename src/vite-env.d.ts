/// <reference types="vite/client" />

import type { IStandaloneCodeEditor } from 'monaco-editor';

export type EditorBundle = {
  HTML: IStandaloneCodeEditor;
  CSS: IStandaloneCodeEditor;
  CODE: IStandaloneCodeEditor;
};