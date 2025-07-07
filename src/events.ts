const elementByID = (id: string) => {
  const element = document.getElementById(id);
  try { if(element) return element; throw new Error('Element not found') } 
  catch (error) { console.error(error) }
};

const toggleTheme = elementByID('toggle-theme')!;

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('light');
})

/* Get editors and their buttons */
const editors = document.querySelectorAll('[data-state]');
const editorButtons = [] as HTMLButtonElement[];
const editorContainers = [] as HTMLElement[];

editors.forEach(editor => {
  if(editor.tagName === 'BUTTON') {
    editorButtons.push(editor as HTMLButtonElement);
  }
  else {
    editorContainers.push(editor as HTMLElement);
  }
})

editorButtons.forEach((editorButton, index) => {
  editorButton.addEventListener('click', (event : MouseEvent) => {
    const button = event.target as HTMLButtonElement;
    
    button.setAttribute('data-state', 'shown');
    
    editorButtons.forEach(editorButton => {
      if (editorButton.id === button.id) {
        return;
      }
      editorButton.setAttribute('data-state', 'hidden');
    })
    
    editorContainers.forEach(editorContainer => {
      if (editorContainer.id === 'preview-container') {
        editorContainer.setAttribute('data-state', 'miniature');
      } else{
        editorContainer.setAttribute('data-state', 'hidden');
      }
    })
    editorContainers[index].setAttribute('data-state', 'shown');
  })
})