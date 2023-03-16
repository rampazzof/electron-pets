const { app, BrowserWindow, ipcMain } = require("electron");
const nodePath = require("path");
const {
  createReservationTableIfNotExists,
  insertRow,
  updateRow,
  deleteRow,
  getRowById,
  findAllRows,
} = require("./database");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: nodePath.join(__dirname, "preload.js"),
    },
  });
  win.loadFile(`${app.getAppPath()}/build/index.html`);
};

app.whenReady().then(async () => {
  await createReservationTableIfNotExists();

  ipcMain.handle("DB:getAll", async (e, args) => {
    await insertRow("2023-03-15", "2023-03-20", "federico", "kira");
    return findAllRows(args?.sortBy, args?.desc);
  });

  app.on(
    "window-all-closed",
    () => process.platform !== "darwin" && app.quit()
  );

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  createWindow();
});
