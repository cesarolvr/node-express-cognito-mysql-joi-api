// const sql = require("../db.js");
import db from "../db.js";

class Log {
  constructor(logItem) {
    this.title = logItem.title;
    this.description = logItem.description;
    this.id = logItem.id;
  }
}

Log.create = (newLog, result) => {
  db.getConnection((err, connection) => {
    db.query("INSERT INTO logs SET ?", newLog, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created log: ", { id: res.insertId, ...newLog });
      result(null, { id: res.insertId, ...newLog });
    });
  });
};

// Log.findById = (id, result) => {
//   db.query(`SELECT * FROM logd WHERE id = ${id}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found log: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     result({ kind: "not_found" }, null);
//   });
// };

// Log.getAll = (title, result) => {
//   let query = "SELECT * FROM logs";

//   if (title) {
//     query += ` WHERE title LIKE '%${title}%'`;
//   }

//   db.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("logs: ", res);
//     result(null, res);
//   });
// };

// Log.getAllPublished = (result) => {
//   db.query("SELECT * FROM logs WHERE published=true", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("logs: ", res);
//     result(null, res);
//   });
// };

// Log.updateById = (id, logItem, result) => {
//   db.query(
//     "UPDATE logs SET title = ?, description = ?, published = ? WHERE id = ?",
//     [logItem.title, logItem.description, logItem.published, id],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated log: ", { id: id, ...logItem });
//       result(null, { id: id, ...logItem });
//     }
//   );
// };

// Log.remove = (id, result) => {
//   db.query("DELETE FROM logs WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted log with id: ", id);
//     result(null, res);
//   });
// };

// Log.removeAll = (result) => {
//   db.query("DELETE FROM logs", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} logs`);
//     result(null, res);
//   });
// };

export default Log;
