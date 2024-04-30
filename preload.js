// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// Context bridge for transfering Facemesh data:

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld( 'api', {
    send: ( channel, data ) => ipcRenderer.sendSync( channel, data ),
    handle: ( channel, callable, event, data ) => ipcRenderer.on( channel, callable( event, data ) )
})
