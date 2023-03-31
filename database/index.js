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
        info          VARCHAR(255),\
        phone         VARCHAR(15) \
    )",
      (err) => (err ? reject(err) : resolve())
    );
  });
};

const insertRow = (
  startDate,
  endDate,
  customerName,
  petName,
  info = "",
  phone
) => {
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
        info, \
        phone )\
    VALUES ( \
        date('now'),
        date('now'),
        "${startDate}",
        "${endDate}",
        "${customerName}",
        "${petName}",
        "${info}",
        "${phone}"
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
  info,
  phone
) => {
  return new Promise((resolve, reject) => {
    getConnection().run(
      `
    UPDATE reservation \
    SET updated_at = date('now'), \
        start_date = ?, \
        end_date = ?, \
        customer_name = ?, \
        pet_name = ?, \
        info = ?, \
        phone = ? \
    WHERE id = ?`,
      [startDate, endDate, customerName, petName, info, phone, id],
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
        info, \
        phone \
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
 * @param {*} period - ['past', 'now', 'next']
 * @returns
 *
 * TODO: check why orderBy and order don't work together as `${orderBy} ${order}`
 */
const findAllRows = (limit, page, orderBy, order, period) => {
  return new Promise((resolve, reject) => {
    let query;
    if (period === "next") {
      query = getNextRevervationsQuery(orderBy, order);
    } else if (period === "now") {
      query = getActualRevervationsQuery(orderBy, order);
    } else {
      query = getPastRevervationsQuery(orderBy, order);
    }
    getConnection().all(query, [limit, limit * page], (err, rows) =>
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

const getNextRevervationsQuery = (orderBy, order) =>
  `SELECT \
      id, \
      start_date AS startDate, \
      end_date AS endDate, \
      customer_name AS customerName, \
      pet_name AS petName, \
      info, \
      phone \
      FROM reservation \
      WHERE start_date >= date('now') \
      ORDER BY ${orderBy} ${order} \
      LIMIT ? OFFSET ?;`;

const getPastRevervationsQuery = (orderBy, order) =>
  `SELECT \
      id, \
      start_date AS startDate, \
      end_date AS endDate, \
      customer_name AS customerName, \
      pet_name AS petName, \
      info, \
      phone \
      FROM reservation \
      WHERE end_date <= date('now') \
      ORDER BY ${orderBy} ${order} \
      LIMIT ? OFFSET ?;`;

const getActualRevervationsQuery = (orderBy, order) =>
  `SELECT \
      id, \
      start_date AS startDate, \
      end_date AS endDate, \
      customer_name AS customerName, \
      pet_name AS petName, \
      info, \
      phone \
      FROM reservation \
      WHERE start_date <= date('now') AND end_date >= date('now') \
      ORDER BY ${orderBy} ${order} \
      LIMIT ? OFFSET ?;`;

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
