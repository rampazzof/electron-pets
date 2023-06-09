const { app, BrowserWindow, ipcMain } = require("electron");
const nodePath = require("path");
const {
  createReservationTableIfNotExists,
  insertRow,
  updateRow,
  deleteRow,
  getRowById,
  findAllRows,
  checkAvailability,
  getCountInAndOut,
} = require("./database");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    maxHeight: 1000,
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

  /**
   * @param {Object} args - Payload from ipc renderer
   * @param {String} args.startDate - Reservation start date | Format YYYY-MM-DD
   * @param {String} args.endDate - Reservation end date | Format YYYY-MM-DD
   * @param {String} args.customerName - Customer name
   * @param {String} args.petName - Pet name
   * @param {String} args.info - Additional info. If undefined = ""
   * @param {String} args.phone - Customer phone number
   */
  ipcMain.handle("DB:reservation:insert", async (e, args) => {
    return insertRow(
      args?.startDate,
      args?.endDate,
      args?.customerName,
      args?.petName,
      args?.info,
      args?.phone
    );
  });

  /**
   * @param {Object} args - Payload from ipc renderer
   * @param {Object} args.id - Reservation ID
   * @param {String} args.startDate - Reservation start date | FormatYYYY-MM-DD
   * @param {String} args.endDate - Reservation end date | Format YYYY-MM-DD
   * @param {String} args.customerName - Customer name
   * @param {String} args.petName - Pet name
   * @param {String} args.info - Additional info. If undefined = ""
   * @param {String} args.phone - Customer phone number
   */
  ipcMain.handle("DB:reservation:update", async (e, args) => {
    return updateRow(
      args?.id,
      args?.startDate,
      args?.endDate,
      args?.customerName,
      args?.petName,
      args?.info,
      args?.phone
    );
  });

  /**
   * @param {Object} args - Payload from ipc renderer
   * @param {Object} args.id - Reservation ID
   */
  ipcMain.handle("DB:reservation:delete", async (e, args) => {
    if (!args.id) throw new Error("id must not be empty");
    return deleteRow(args.id);
  });

  /**
   * @param {Object} args - Payload from ipc renderer
   * @param {Object} args.id - Reservation ID
   */
  ipcMain.handle("DB:reservation:getById", async (e, args) => {
    return getRowById(args?.id);
  });

  /**
   * @param {Object} args - Payload from ipc renderer
   * @param {String} args.limit - How many item per page.
   * @param {String} args.page - Page number (start from 0)
   * @param {String} args.orderBy - Column to be sorted (snake_case). Default start_date.
   * @param {String} args.order - Sort direction. ASC || DESC. Default ASC.
   */
  ipcMain.handle("DB:reservation:findAll", async (e, args) => {
    return findAllRows(
      args.limit,
      args.page,
      args?.orderBy,
      args?.order,
      args?.periodFilter,
      args?.fromFilter,
      args?.toFilter
    );
  });

  ipcMain.handle("DB:reservation:checkAvailability", async (e, args) => {
    return checkAvailability(args.startDate, args.endDate);
  });

  ipcMain.handle("DB:reservation:getCountInAndOut", async (e, args) => {
    return getCountInAndOut(args.date);
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
