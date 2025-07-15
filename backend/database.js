const mysql = require("mysql2");

const connection = mysql.createConnection({
  user: "root",
  password: "Innuma2000",
  database: "Innuma",
  /*socketPath: "/tmp/mysql.sock", // <<< questa è la chiave!*/
});

connection.connect((err) => {
  if (err) {
    console.error("Errore di connessione:", err.message);
    return;
  }
  console.log("✅ Connessione riuscita!");
});

// Per usare l'API delle Promise (raccomandato per async/await)
const promiseConnection = connection.promise();
module.exports = {
  connection,
  promiseConnection,
};
