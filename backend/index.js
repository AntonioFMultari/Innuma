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
//GET -> events - leggi da events.json
app.get("/events", (req, res) => {
  const { end, start } = req.query;

  const eventsPath = path.join(__dirname, "./events.json");
  const eventsData = fs.readFileSync(eventsPath, "utf-8");
  const events = JSON.parse(eventsData)["events"];

  if (!start || !end) {
    res.json(events);
    return;
  }

  const dataInizio = new Date(start);
  const dataFine = new Date(end);

  dataInizio.setHours(0, 0, 0, 0);
  dataFine.setHours(23, 59, 59, 999);

  res.json(
    events.filter((evento) => {
      const dataEventoInizio = new Date(evento.start);
      const dataEventoFine = new Date(evento.end);
      dataEventoInizio.setHours(0, 0, 0, 0);
      dataEventoFine.setHours(23, 59, 59, 999);
      return dataEventoInizio >= dataInizio && dataEventoFine <= dataFine;
    })
  );
});

app.post("/events", express.json(), (req, res) => {
  const newEvent = req.body;
  const eventsPath = path.join(__dirname, "./events.json");

  // Read existing events
  const eventsData = fs.readFileSync(eventsPath, "utf-8");
  const events = JSON.parse(eventsData)["events"];

  // add id: new UUID to new event
  newEvent.id = crypto.randomUUID();

  // Add new event
  events.push(newEvent);

  // Write updated events back to file
  fs.writeFileSync(eventsPath, JSON.stringify({ events }, null, 2));

  res.status(201).json(newEvent);
});

//delete -> events/:id - elimina un evento
app.delete("/events/:id", (req, res) => {
  const eventId = req.params.id;
  const eventsPath = path.join(__dirname, "./events.json");

  // Read existing events
  const eventsData = fs.readFileSync(eventsPath, "utf-8");
  const events = JSON.parse(eventsData)["events"];

  // Filter out the event to delete
  const updatedEvents = events.filter((evento) => evento.id !== eventId);

  // Write updated events back to file
  fs.writeFileSync(
    eventsPath,
    JSON.stringify({ events: updatedEvents }, null, 2)
  );

  res.status(204).send();
});

//query sul database
const db = require("./database.js"); // Supponendo che tu abbia salvato il tuo pool in db.js

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

app.get("/db-events", async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Errore durante il recupero degli eventi" });
  }
});

app.post("/db-events", express.json(), async (req, res) => {
  const newEvent = req.body;

  try {
    // Esegui una query INSERT
    const [result] = await db.promiseConnection.query(
      "INSERT INTO events (title, start, end) VALUES (?, ?, ?)",
      [newEvent.title, newEvent.start, newEvent.end]
    );
    newEvent.id = result.insertId; // Aggiungi l'ID generato dal database
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Errore durante l'inserimento dell'evento:", err);
    res.status(500).json({ error: "Errore durante l'inserimento dell'evento" });
  }
});

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
