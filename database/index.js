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
  return new Promise((resolve, reject) => {
    getConnection().run(
      "CREATE TABLE IF NOT EXISTS reservation (\
        id            INTEGER PRIMARY KEY AUTOINCREMENT,\
        inserted_at   DATE NOT NULL,\
        updated_at    DATE NOT NULL,\
        start_date    DATE NOT NULL,\
        end_date      DATE NOT NULL,\
        customer_name VARCHAR(20) NOT NULL,\
        pet_name      VARCHAR(20),\
        info          VARCHAR(255)\
    )",
      (err) => (err ? reject(err) : resolve())
    );
  });
};

const insertRow = (startDate, endDate, customerName, petName, info = "") => {
  return new Promise((resolve, reject) => {
    getConnection().run(
      `
    INSERT INTO reservation (\
        inserted_at, \
        updated_at, \
        start_date, \
        end_date, \
        customer_name, \
        pet_name, \
        info )\
    VALUES ( \
        date('now'),
        date('now'),
        "${startDate}",
        "${endDate}",
        "${customerName}",
        "${petName}",
        "${info}"
    )`,
      (err) => (err ? reject(err) : resolve())
    );
  });
};

const updateRow = (
  id,
  startDate,
  endDate,
  customerName,
  petName,
  info = ""
) => {
  return new Promise((resolve, reject) => {
    getConnection().run(
      `
    UPDATE TABLE reservation \
    SET updated_at = date('now') \
        start_date = ${startDate} \
        end_date = ${endDate} \
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
        start_date AS startDate, \
        end_date   AS endDate, \
        customer_name AS customerName, \
        pet_name AS petName, \
        info \
       FROM reservation \
       WHERE id = ${id}`,
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });
};

/**
 *
 * @param {*} limit
 * @param {*} page
 * @param {*} orderBy - exact name of the field, default start_date
 * @param {*} order - ASC or DESC, default ASC
 * @returns
 */
const findAllRows = (limit, page, orderBy, order) => {
  return new Promise((resolve, reject) => {
    getConnection().all(
      `SELECT \
        id, \
        start_date AS startDate, \
        end_date AS endDate, \
        customer_name AS customerName, \
        pet_name AS petName, \
        info \
       FROM reservation \
       ORDER BY ${orderBy || "start_date"} ${order || "ASC"} \
       LIMIT ${limit} OFFSET ${limit * page};`,
      (err, rows) =>
        err
          ? reject(err)
          : getConnection().get(
              `SELECT COUNT(1) as count FROM reservation;`,
              (countErr, row) =>
                countErr
                  ? reject(countErr)
                  : resolve({ reservations: rows, count: row.count })
            )
    );
  });
};

const countBetweenDates = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    getConnection().get(
      `SELECT COUNT(1) as count FROM reservation WHERE start_date >= ${startDate} AND end_date <= ${endDate}`,
      (err, res) => (err ? reject(err) : resolve(res))
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
  countBetweenDates,
};
