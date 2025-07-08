const monaco = await import('monaco-editor');
import { emmetHTML, emmetCSS, emmetJSX } from 'emmet-monaco-es'

export const createEditor = (editorContainer: HTMLElement, language: string, value = '') => {
  try {
    return monaco.editor.create(editorContainer, {
      value: value,
      language: language,
      theme: 'vs-dark',
      wordWrap: 'on',
      automaticLayout: true,
      fixedOverflowWidgets: true,
    })
  } catch (error) {
    console.error(error)
  }
}

export const disposeEditor = () => {
  try {
    monaco.editor.getEditors().forEach((editor) => {
      editor.dispose()
    })
    toggleEmmet();
  } catch (error) {
    console.error(error)
  }
}

export const setEnvironmentalVariables = () => {
  try {
    toggleEmmet();
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  } catch (error) {
    console.error(error)
  }
}

export const toggleEmmet = () => {
  emmetHTML(monaco, ['html'])
  emmetCSS(monaco, ['css'])
  emmetJSX(monaco, ['javascript', 'typescript'])
}