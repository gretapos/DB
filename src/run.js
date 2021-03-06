import * as readline from "readline";
import * as mysql from "mysql";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(msg) {
  return new Promise((resolve) => {
    rl.question(msg, (txt) => {
      resolve(txt);
    });
  });
}

const OPTIONS = {
  host: "192.168.1.2",
  user: "zmones",
  password: "zmones1234",
  database: "zmones1234",
  multipleStatements: true,
};

function connect() {
  return new Promise((resolve, reject) => {
    let conn = mysql.createConnection(OPTIONS);
    conn.connect((err) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });
}

function query(conn, sql, values) {
  return new Promise((resolve, reject) => {
    conn.query({
      sql,
      values,
    }, (err, results, fields) => {
      if (err) {
        return reject(err);
      }
      resolve({ results, fields });
    });
  });
}

function end(conn) {
  return new Promise((resolve, reject) => {
    conn.end((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function printResults({ results, fields }) {
  if (Array.isArray(fields) && Array.isArray(results)) {
    let header = "";
    for (const field of fields) {
      header += field.name + "\t";
    }
    console.log(header);
    for (const row of results) {
      let rowStr = "";
      for (const field of fields) {
        rowStr += row[field.name] + "\t";
      }
      console.log(rowStr);
    }
  }
}

let choise;
while (choise !== 0) {
  console.log("1. Visi cekiai");
  console.log("2. Naujas cekis");
  console.log("3. Istrinti ceki");
  console.log("0. Baigti");
  choise = parseInt(await input("Pasirink: "));
  let conn;
  let r;
  try {
    conn = await connect();
    switch (choise) {
      case 1:
        r = await query(
          conn,
          "select * from cekiai order by parduotuve;",
        );
        printResults(r);
        break;
      case 2:
        let pav = await input("Ivesk pavadinima: ");
        let data = await input("Ivesk data: ");
        data = new Date(data);
        await query(
          conn,
          "insert into cekiai (data, parduotuve) values (?, ?);",
          [data, pav],
        );
        break;
      case 3:
        let id = await input("Ivesk id: ");
        id = parseInt(id);
        await query(
          conn,
          "delete from cekiai where id = ?;",
          [id],
        );
        break;
    }
  } catch (err) {
    console.log("Klaida", err);
  } finally {
    if (conn) {
      try {
        await end(conn);
      } catch (e) {
        // ignored
      }
    }
  }
}

/*1. visi zmones
2. naujas zmogus
3. istrinti zmogu
4. visi zmogaus adresai
5. naujas zmogaus adresas
6. istrinti zmogaus adresa
7. visi zmogaus kontaktai
8. naujas zmogaus kontaktas
9. istrinti zmogaus kontakta
0. baigti */

// let id = await input("Ivesk id: ");
// id = parseInt(id);
// let pav = await input("Ivesk kita pavadinima: ");
// let data = await input("Ivesk kita data: ");
// data = new Date(data);

// let conn;
// try {
//   conn = await connect();
//   const r = await query(
//     conn,
//     "update cekiai set data=?, parduotuve=? where id=?;",
//     [data, pav, id],
//   );
//   console.log(r);
// } catch (err) {
//   console.log("Klaida", err);
// } finally {
//   if (conn) {
//     try {
//       await end(conn);
//     } catch (e) {
//       // ignored
//     }
//   }
// }

// let id = await input("Ivesk id: ");
// id = parseInt(id);
// let conn;
// try {
//   conn = await connect();
//   const r = await query(
//     conn,
//     "delete from cekiai where id = ?;",
//     [id],
//   );
//   console.log(r);
// } catch (err) {
//   console.log("Klaida", err);
// } finally {
//   if (conn) {
//     try {
//       await end(conn);
//     } catch (e) {
//       // ignored
//     }
//   }
// }

// let pav = await input("Ivesk pavadinima: ");
// let data = await input("Ivesk data: ");
// data = new Date(data);

// let conn;
// try {
//   conn = await connect();
//   const r = await query(
//     conn,
//     "insert into cekiai (data, parduotuve) values (?, ?);",
//     [data, pav],
//   );
//   console.log(r);
// } catch (err) {
//   console.log("Klaida", err);
// } finally {
//   if (conn) {
//     try {
//       await end(conn);
//     } catch (e) {
//       // ignored
//     }
//   }
// }

// let pav = await input("Ivesk pavadinima: ");
// pav = "%" + pav + "%";

// let conn;
// try {
//   conn = await connect();
//   const r = await query(
//     conn,
//     "select * from cekiai where parduotuve like ?;",
//     [pav],
//   );
//   printResults(r);
// } catch (err) {
//   console.log("Klaida", err);
// } finally {
//   if (conn) {
//     try {
//       await end(conn);
//     } catch (e) {
//       // ignored
//     }
//   }
// }
rl.close();
