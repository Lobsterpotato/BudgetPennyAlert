import { app, BrowserWindow } from "electron";
import * as path from "path";
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
  const startUrl = isDev ? "http://localhost:5173" : `file://${path.join(__dirname, "../dist/index.html")}`;
  mainWindow.loadURL(startUrl);
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
