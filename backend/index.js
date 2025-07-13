import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../")));

//open cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);

  if (Object.keys(req.params).length > 0) {
    console.log("Params:", req.params);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

//query sul database
const db = require("./database.js"); // Supponendo che tu abbia salvato il tuo pool in database.js

async function getEvents() {
  try {
    // Esegui una query SELECT
    const [rows, fields] = await db.promiseConnection.query(
      "SELECT e.Titolo AS title, e._dataInizio AS start, e._dataFine AS end, a.Colore AS color, e.NomeCliente AS nome_cliente, a.Tariffa AS tariffa_oraria, e.Titolo AS descrizione_evento, a.INPS AS rivalsa_inps FROM evento e JOIN evento_attivita ea ON e.ID = ea.ID_Evento JOIN attività a ON ea.ID_Attivita = a.ID;"
    );
    console.log("Eventi:", rows, fields);
    return rows;
  } catch (err) {
    console.error("Errore durante il recupero degli eventi:", err);
    throw err;
  }
}

async function getAttivita() {
  try {
    // Esegui una query SELECT
    const [rows, fields] = await db.promiseConnection.query(
      "SELECT * FROM attività;"
    );
    console.log("Attività:", rows, fields);
    return rows;
  } catch (err) {
    console.error("Errore durante il recupero delle attività:", err);
    throw err;
  }
}

//PAGINA CALENDARIO
//GET -> PRENDI TUTTI GLI EVENTI
app.get("/db-events", async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Errore durante il recupero degli eventi" });
  }
});

//GET -> PRENDI TUTTE LE ATTIVITA'
app.get("/db-attivita", async (req, res) => {
  try {
    const attivita = await getAttivita();
    res.json(attivita);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Errore durante il recupero delle attività" });
  }
});

//POST -> INSERISCI UN NUOVO EVENTO
// Assicurati che il body della richiesta sia in formato JSON
app.post("/db-events", express.json(), async (req, res) => {
  const newEvent = req.body;
  console.log("Nuovo evento ricevuto:", newEvent);

  try {
    newEvent.start = new Date(newEvent.start)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    newEvent.end = new Date(newEvent.end)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    console.log("Dati che sto per inserire:", [
      newEvent.start,
      newEvent.end,
      newEvent.title,
      newEvent.nome_cliente,
      newEvent.id_attivita,
    ]);

    const [result] = await db.promiseConnection.query(
      "START TRANSACTION; INSERT INTO evento (_dataInizio, _dataFine, Titolo, NomeCliente, Fattura) VALUES (?, ?, ?, ?, 1); SET @last_evento_id = LAST_INSERT_ID(); INSERT INTO evento_attivita (ID_Evento, ID_Attivita) VALUES (@last_evento_id, ?); COMMIT;",
      [
        newEvent.start,
        newEvent.end,
        newEvent.title,
        newEvent.nome_cliente,
        newEvent.id_attivita,
      ]
    );
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Errore durante l'inserimento dell'evento:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

//DELETE -> ELIMINA UN EVENTO
// Assicurati che l'ID dell'evento sia passato come parametro nella URL
app.delete("/db-events/:id", async (req, res) => {
  const eventId = req.params.id;

  try {
    // Esegui una query DELETE
    await db.promiseConnection.query("DELETE FROM evento WHERE id = ?", [
      eventId,
    ]);
    res.status(204).send();
  } catch (err) {
    console.error("Errore durante l'eliminazione dell'evento:", err);
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'evento" });
  }
});

// PUT -> AGGIORNA UN EVENTO
app.put("/db-events/:id", express.json(), async (req, res) => {
  const eventId = req.params.id;
  const updatedEvent = req.body;
  try {
    await db.promiseConnection.query(
      "UPDATE events SET start = ?, end = ? WHERE id = ?",
      [updatedEvent.start, updatedEvent.end, eventId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Errore durante l'aggiornamento dell'evento:", err);
    res
      .status(500)
      .json({ error: "Errore durante l'aggiornamento dell'evento" });
  }
});
