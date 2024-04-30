// main.js

// Modules to control appliication life and create native browser window

const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const {systemPreferences} = require('electron')
systemPreferences.askForMediaAccess('camera')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    }
  })

  // and load the index.html of the app.

  mainWindow.loadFile('index.html')
}

// Spawn window:

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Require OSC library:

var osc = require("osc");

// Spawn a UPD port, using sclangs default port:

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    metadata: true
});

// Open the port:

udpPort.open();

// Recieve data from Mediapipe, send it through OSC:

ipcMain.on('custom-endpoint', (event, arg) => {
  console.log(arg) // prints "ping"
  // Have to return something when using this tranposrt thing
  udpPort.send({
    address: "/facemesh/mouth/height", // Height data
    args: [
      {
        type: "f",
        value: arg[0]
      }
    ]
  }, "127.0.0.1", 57120);

  udpPort.send({
    address: "/facemesh/mouth/width", // Width data
    args: [
      {
        type: "f",
        value: arg[1]
      }
    ]
  }, "127.0.0.1", 57120);
event.returnValue = 'pong'
})

// MacOs quit thing

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
