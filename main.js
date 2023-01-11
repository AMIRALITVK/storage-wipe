const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let Dev_Mode = true;
// var socket = require("socket.io-client")("http://socket.cloudify.ir:5006");
let mainWindow = null;

app.setLoginItemSettings({
  openAtLogin: false,
});

function createWindow() {
  mainWindow = new BrowserWindow({
    resizable: true,
    width: 850,
    height: 800,
    minWidth: 800,
    show: true,
    icon: "src/appicon.png",
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, "renderer.js"),
      // preload: path.join(__dirname, 'preload.js')
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("./index.html");
}

app.whenReady().then(() => {
  createWindow();
  // mainWindow.hide();
  mainWindow.show();
  mainWindow.focus();
  // globalShortcut.register("CommandOrControl+Alt+M", () => {
  //   if (mainWindow.isMinimized()) {
  //     mainWindow.show();
  //   } else {
  //   }
  // });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
