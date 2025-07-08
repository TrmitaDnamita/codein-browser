import * as monaco from './monaco'
import * as encryptor from './encriptor'
import type { EditorBundle } from '../vite-env';

const docRef = {
  iframeRef: 'data:text/html;base64,',
  baseURL: '',
  split: ' ?codein? ',
  htmlLoad: `<main>
  <h1 id="welcome-screen">👋 Welcome to CodeIn Browser</h1>
  <p>This editor is already inside the <code>&lt;body&gt;</code> tag, so you can start writing HTML directly 💻.</p>
  <p>The JavaScript tab also supports <strong>TypeScript</strong> and is loaded at the end of the body 🧠.</p>
  <p>The URL will be encrypted after the <em>'#'</em> symbol and can be shared with anyone you trust 🤝. <strong>Changes will persist on reload</strong></p>
  <button id="confeti-boy">Click Me!</button>\n</main>`,
  cssLoad: `html {
  background-color: #282c34;
  color: #d4d4d4;
  text-align: center;
  padding: 1rem;
  font-family: system-ui, Oxygen, sans-serif;
}`,
  jsLoad: `import confetti from 'https://cdn.skypack.dev/canvas-confetti'

document.getElementById('confeti-boy')
    .addEventListener('click', () => confetti());
;`, 
}

const element = {
  'html': '#html-container',
  'css': '#css-container',
  'code': '#code-container',
  'preview': '#preview-container',
};

const getElement = (id: string) => document.querySelector<HTMLElement>(id)!;

const setEditors = (htmlValue = '', cssValue = '', jsValue = '') => {
  return {
    HTML: monaco.createEditor(getElement(element.html), 'html', htmlValue),
    CSS: monaco.createEditor(getElement(element.css), 'css', cssValue),
    CODE: monaco.createEditor(getElement(element.code), 'javascript', jsValue)
  };
}

const refreshIframe = (value : string[]) => {
  const iframe = document.getElementById('preview-container')! as HTMLIFrameElement;
  
  const base64Document = encryptor.encodeBase64(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CodeIn Browser</title>
        <style>${value[1]}</style>
      </head>
      <body>
        ${value[0]}
        <script type="module">${value[2]}</script>
      </body>
    </html>
    `);
  
  iframe.src = `${docRef.iframeRef}${base64Document}`;
}
/**@param pastedHash external hash pasted by user, if empty reads from #URL */
const initWithURL = (pastedHash = '') => { //TODO : fix this
  if (pastedHash) { /* if user pasted another's encrypted code */
    const lzResult = encryptor.decryptLZ(pastedHash).split(docRef.split);
    return {
      html: lzResult[0],
      css: lzResult[1],
      code: lzResult[2]
    };
  }

  const url = location.href.split('#');

  docRef.baseURL = url[0];
  const editorValues = encryptor.decryptLZ(url[1]).split(docRef.split);
  
  refreshIframe(editorValues);
  return {
    html: editorValues[0],
    css: editorValues[1],
    code: editorValues[2]
  }
}

export const init = (isHashed: boolean): EditorBundle | Error => {
  try {
    const editorValues = {
      HTML: docRef.htmlLoad,
      CSS: docRef.cssLoad,
      CODE: docRef.jsLoad
    };

    if (isHashed) {
      const { html, css, code } = initWithURL();
      editorValues.HTML = html;
      editorValues.CSS = css;
      editorValues.CODE = code;
    }else {
      refreshIframe([editorValues.HTML, editorValues.CSS, editorValues.CODE]);
    }

    return setEditors(editorValues.HTML, editorValues.CSS, editorValues.CODE);
  }
  catch (error) {
    throw new Error(`🚨 Unable to load editor | 🚨 ${error}`);
  }
}

export const update = (value: string[]): void => {
  const encryptedPage = encryptor.encryptLZ(`${value[0]}${docRef.split}${value[1]}${docRef.split}${value[2]}`);
  
  location.href = `${docRef.baseURL}#${encryptedPage}`;

  refreshIframe(value);
}