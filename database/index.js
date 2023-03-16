const sqlite3 = require("sqlite3");

let db;

const getConnection = () => {
  if (db) {
    return db;
  }
  db = new sqlite3.Database(__dirname + "store.db");
  return db;
};

const createReservationTableIfNotExists = () => {
  console.log("create reservation table");
  return new Promise((resolve, reject) => {
    getConnection().run(
      "CREATE TABLE IF NOT EXISTS reservation (\
        id            INTEGER PRIMARY KEY AUTOINCREMENT,\
        inserted_at   DATE NOT NULL,\
        updated_at    DATE NOT NULL,\
        date_from     DATE NOT NULL,\
        date_to       DATE NOT NULL,\
        customer_name VARCHAR(20) NOT NULL,\
        pet_name      VARCHAR(20),\
        info          VARCHAR(255)\
    )",
      (err) => (err ? reject(err) : resolve())
    );
  });
};

const insertRow = (dateFrom, dateTo, customerName, petName, info = "") => {
  return new Promise((resolve, reject) => {
    getConnection().run(
      `
    INSERT INTO reservation (\
        inserted_at, \
        updated_at, \
        date_from, \
        date_to, \
        customer_name, \
        pet_name, \
        info )\
    VALUES ( \
        date('now'),
        date('now'),
        "${dateFrom}",
        "${dateTo}",
        "${customerName}",
        "${petName}",
        "${info}"
    )`,
      (err) => (err ? reject(err) : resolve())
    );
  });
};

const updateRow = (id, dateFrom, dateTo, customerName, petName, info = "") => {
  return new Promise((resolve, reject) => {
    getConnection().run(
      `
    UPDATE TABLE reservation \
    SET updated_at = date('now') \
        date_from = ${dateFrom} \
        date_to = ${dateTo} \
        customer_name = ${customerName} \
        pet_name = ${petName} \
        info = ${info} \
    WHERE id = ${id}`,
      (err) => (err ? reject(err) : resolve())
    );
  });
};

const deleteRow = (id) => {
  return new Promise((resolve, reject) => {
    getConnection().run(`DELETE FROM reservation WHERE id = ${id}`, (err) =>
      err ? reject(err) : resolve()
    );
  });
};

const getRowById = (id) => {
  return new Promise((resolve, reject) => {
    getConnection().get(
      `SELECT \
        id, \
        date_from AS dateFrom, \
        date_to AS dateTo, \
        customer_name AS customerName, \
        pet_name AS petName, \
        info \
       FROM reservation \
       WHERE id = ${id}`,
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};

const findAllRows = (sortBy, desc) => {
  return new Promise((resolve, reject) => {
    getConnection().all(
      `SELECT \
        id, \
        date_from AS dateFrom, \
        date_to AS dateTo, \
        customer_name AS customerName, \
        pet_name AS petName, \
        info \
       FROM reservation \
       ORDER BY ${sortBy ? sortBy : "date_from"} ${desc ? "DESC" : "ASC"}`,
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
};

module.exports = {
  createReservationTableIfNotExists,
  insertRow,
  updateRow,
  deleteRow,
  getRowById,
  findAllRows,
};
