import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { get } from "http";

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
      "SELECT * FROM events"
    );
    console.log("Eventi:", rows, fields);
    return rows;
  } catch (err) {
    console.error("Errore durante il recupero degli eventi:", err);
    throw err;
  }
}

//GET -> PRENDI TUTTI GLI EVENTI
app.get("/db-events", async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Errore durante il recupero degli eventi" });
  }
});

//POST -> INSERISCI UN NUOVO EVENTO
// Assicurati che il body della richiesta sia in formato JSON
app.post("/db-events", express.json(), async (req, res) => {
  const newEvent = req.body;
  console.log("Nuovo evento ricevuto:", newEvent);

  try {
    newEvent.rivalsa_inps = newEvent.rivalsa_inps ? 1 : 0;
    newEvent.tariffa_oraria = Number(newEvent.tariffa_oraria).toFixed(2);
    newEvent.start = new Date(newEvent.start)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    newEvent.end = new Date(newEvent.end)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    console.log("Dati che sto per inserire:", [
      newEvent.title,
      newEvent.start,
      newEvent.end,
      newEvent.color,
      newEvent.nome_cliente,
      newEvent.tariffa_oraria,
      newEvent.descrizione_evento,
      newEvent.rivalsa_inps,
      2,
      newEvent.tipo_attivita,
    ]);

    const [result] = await db.promiseConnection.query(
      "INSERT INTO events (title, start, end, color, nome_cliente, tariffa_oraria, descrizione_evento, rivalsa_inps, marca_da_bollo, tipo_attivita) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newEvent.title,
        newEvent.start,
        newEvent.end,
        newEvent.color,
        newEvent.nome_cliente,
        newEvent.tariffa_oraria,
        newEvent.descrizione_evento,
        newEvent.rivalsa_inps,
        2,
        newEvent.tipo_attivita,
      ]
    );
    newEvent.id = result.insertId;
    newEvent.marca_da_bollo = 2;
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
    await db.promiseConnection.query("DELETE FROM events WHERE id = ?", [
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
