import { disposeEditor, setEnvironmentalVariables } from './utils/monaco';
import * as loader from './utils/docLoader';

window.onbeforeunload = () => disposeEditor();

try {
  const result = loader.init(location.hash !== '');
  if (result instanceof Error) throw result;
  
  const { HTML, CSS, CODE } = result;
  const getEditorValues = () => [
    HTML?.getValue() || '',
    CSS?.getValue() || '',
    CODE?.getValue() || '',
  ];
  
  setEnvironmentalVariables();
  
  const updatePreview = () => {
    loader.update(getEditorValues());
  };

  [HTML, CSS, CODE].forEach(editor => {
    editor?.onDidChangeModelContent(updatePreview);
  });
}
catch (error) {
  console.error(error);
}