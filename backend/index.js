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
      `SELECT 
       e.ID AS id,
        e.Titolo AS title,
        e._dataInizio AS start,
        e._dataFine AS end,
        a.Colore AS color,
        e.NomeCliente AS nome_cliente,
        e.descrizione AS descrizione_evento,
        a.Tariffa AS tariffa_oraria,
        a.INPS AS rivalsa_inps,
        a.descrizione AS descrizione_attivita
      FROM evento e
      JOIN evento_attivita ea ON e.ID = ea.ID_Evento
      JOIN attività a ON ea.ID_Attivita = a.ID
      ORDER BY e._dataInizio;`
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

async function getSpese() {
  try {
    // Esegui una query SELECT
    const [rows, fields] = await db.promiseConnection.query(
      "SELECT * FROM spese ORDER BY _data DESC;"
    );
    console.log("Spese:", rows, fields);
    return rows;
  } catch (err) {
    console.error("Errore durante il recupero delle spese:", err);
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

app.get("/db-spesa", async (req, res) => {
  try {
    const spese = await getSpese();
    res.json(spese);
  } catch (err) {
    res.status(500).json({ error: "Errore durante il recupero delle spese" });
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
      newEvent.descrizione_evento,
      newEvent.id_attivita,
    ]);

    // Prima: inserisci il nuovo evento
    const [insertEventoResult] = await db.promiseConnection.query(
      "INSERT INTO evento (_dataInizio, _dataFine, Titolo, NomeCliente, Descrizione, Fattura) VALUES (?, ?, ?, ?, ?, 1)",
      [
        newEvent.start,
        newEvent.end,
        newEvent.title,
        newEvent.nome_cliente,
        newEvent.descrizione_evento,
      ]
    );

    // Ottieni l'ID dell'evento appena inserito
    const lastEventoId = insertEventoResult.insertId;

    // Poi: inserisci la relazione evento-attività
    await db.promiseConnection.query(
      "INSERT INTO evento_attivita (ID_Evento, ID_Attivita) VALUES (?, ?)",
      [lastEventoId, newEvent.id_attivita]
    );
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Errore durante l'inserimento dell'evento:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.post("/db-attivita", express.json(), async (req, res) => {
  const newActivity = req.body;
  console.log("Nuova attività ricevuta:", newActivity);
  try {
    // Esegui una query INSERT
    const [result] = await db.promiseConnection.query(
      "INSERT INTO attività (Descrizione, Tariffa, Colore, INPS) VALUES (?, ?, ?, ?)",
      [
        newActivity.Descrizione,
        newActivity.Tariffa,
        newActivity.Colore,
        newActivity.INPS,
      ]
    );
    newActivity.ID = result.insertId; // Aggiungi l'ID generato all'oggetto dell'attività
    res.status(201).json(newActivity);
  } catch (err) {
    console.error("Errore durante l'inserimento dell'attività:", err);
    res
      .status(500)
      .json({ error: "Errore durante l'inserimento dell'attività" });
  }
});

app.post("/db-spesa", express.json(), async (req, res) => {
  const newSpesa = req.body;
  console.log("Nuova spesa ricevuta:", newSpesa);
  try {
    // Esegui una query INSERT
    const [result] = await db.promiseConnection.query(
      "INSERT INTO spese (Descrizione, Uscita, _data) VALUES (?, ?, ?)",
      [newSpesa.Descrizione, newSpesa.Uscita, newSpesa._data]
    );
    newSpesa.ID = result.insertId; // Aggiungi l'ID generato
    res.status(201).json(newSpesa);
  } catch (err) {
    console.error("Errore durante l'inserimento della spesa:", err);
    res.status(500).json({ error: "Errore durante l'inserimento della spesa" });
  }
});

//DELETE -> ELIMINA UN EVENTO
// Assicurati che l'ID dell'evento sia passato come parametro nella URL
app.delete("/db-events/:id", async (req, res) => {
  const eventId = req.params.id;
  console.log("ID evento da eliminare:", eventId);

  try {
    // Esegui una query DELETE
    await db.promiseConnection.query(
      "DELETE FROM evento_attivita WHERE ID_Evento = ?",
      [eventId]
    );
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

app.delete("/db-attivita/:id", async (req, res) => {
  const AttId = req.params.id;
  console.log("ID Attività da eliminare:", AttId);

  try {
    // Trova tutti gli eventi collegati a questa attività
    const [eventiCollegati] = await db.promiseConnection.query(
      "SELECT ID_Evento FROM evento_attivita WHERE ID_Attivita = ?",
      [AttId]
    );

    // Elimina tutte le relazioni evento-attività per questa attività
    await db.promiseConnection.query(
      "DELETE FROM evento_attivita WHERE ID_Attivita = ?",
      [AttId]
    );

    // Elimina tutti gli eventi collegati (se ce ne sono)
    if (eventiCollegati.length > 0) {
      const idsEventi = eventiCollegati.map((ev) => ev.ID_Evento);
      await db.promiseConnection.query(
        `DELETE FROM evento WHERE ID IN (${idsEventi
          .map(() => "?")
          .join(",")})`,
        idsEventi
      );
    }

    // Elimina l'attività
    await db.promiseConnection.query("DELETE FROM attività WHERE ID = ?", [
      AttId,
    ]);

    res.status(204).send();
  } catch (err) {
    console.error("Errore durante l'eliminazione dell'attività:", err);
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'attività" });
  }
});

//DELETE -> ELIMINA UNA SPESA
app.delete("/db-spesa/:id", async (req, res) => {
  const spesaId = req.params.id;
  console.log("ID Spesa da eliminare:", spesaId);

  try {
    // Esegui una query DELETE
    await db.promiseConnection.query("DELETE FROM spese WHERE ID = ?", [
      spesaId,
    ]);
    res.status(204).send();
  } catch (err) {
    console.error("Errore durante l'eliminazione della spesa:", err);
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione della spesa" });
  }
});

// PUT -> AGGIORNA UN EVENTO
app.put("/db-events/:id", express.json(), async (req, res) => {
  const eventId = req.params.id;
  const updatedEvent = req.body;
  try {
    await db.promiseConnection.query(
      "UPDATE evento SET _dataInizio = ?, _dataFine = ? WHERE id = ?",
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

// PUT -> AGGIORNA UN' ATTIVITA
app.put("/db-attivita/:id", express.json(), async (req, res) => {
  const AttId = req.params.id;
  const dati = req.body;
  try {
    await db.promiseConnection.query(
      "UPDATE attività SET Descrizione = ?, Tariffa = ?, Colore = ?, INPS = ? WHERE ID = ?",
      [dati.Descrizione, dati.Tariffa, dati.Colore, dati.INPS, AttId]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Errore durante la modifica dell'attività:", err);
    res.status(500).json({ error: "Errore durante la modifica dell'attività" });
  }
});
