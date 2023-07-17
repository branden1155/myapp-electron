
//Import electron api contextbridge and ipcRender to display notification pop-up
const { contextBridge, ipcRenderer } = require('electron');

//Initializes, or makes sure that content is pre-loaded... This is a default pre-load event listener.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })

//A method to transfer or 'bridge information from the preload.js package to the index.html page'

//This is for the notification button
contextBridge.exposeInMainWorld('electron', {
  notification: (title, body) => {
    ipcRenderer.send('show-notification', title, body);
  },
//This is for the create-new-window button
  createNewWindow: () => {
    ipcRenderer.invoke('create-new-window');
  },
});
