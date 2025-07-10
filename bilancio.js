// Pagina Bilancio
function BalancePage() {
  //la cartella dove mettiamo tutte i contenuti della pagina bilancio
  const wrapperBilancio = document.createElement("div");
  wrapperBilancio.classname = "contenitoreBilancio";

  //la cartella per il chart e transazioni
  const cartellaBilancio = document.createElement("div");
  cartellaBilancio.classname = "cartellaBilancio";

  //parte chart
  const cartBilSinistra = document.createElement("div");
  cartBilSinistra.classname = "cartellaSinitra";

  //chart codice preso da Pietro Bosio

  //filtri sotto il chart (copiando come si scrive su HTML per i filtri sopra il calendario)
  const contenutoFiltri = document.createElement("div");
  contenutoFiltri.classname = "contFiltri";
  contenutoFiltri.innerHTML =
    '<div class="pallino"><span class="spanFiltro">Scuola Fisica</span></div>';
  contenutoFiltri.innerHTML =
    '<div class="pallino"><span class="spanFiltro">Scuola Online</span></div>';
  contenutoFiltri.innerHTML =
    '<div class="pallino"><span class="spanFiltro">Ripetizioni</span></div>';
  cartBilSinistra.appendChild(contenutoFiltri);

  //bottone per entrata e uscita
  const entraUscita = document.createElement("button");
  entraUscita.textContent = "Entrate/Uscite";
  entraUscita.classname = "btnEntUsc";
  cartBilSinistra.appendChild(entraUscita);

  //collega la parte sinistra sulla cartella principiale
  cartellaBilancio.appendChild(cartBilSinistra);

  //parte transazioni
  const cartBilDestra = document.createElement("div");
  cartBilDestra.classname = "cartellaDestra";

  //dove mettiamo il titolo (o transizioni o Scuola Online) per es.
  const titolo = document.createElement("h1");
  titolo.textContent = "Transazioni";
  titolo.classname = "headerTransazione";
  cartBilDestra.appendChild(title);

  //l'elenco delle transazioni
  const elencoTransazioni = document.createElement("div");
  elencoTransazioni.classname = "listaTrans";
  /*
   */
  //fa un loop e crea un elemento per ogni transactions (questo anche ma studierò, sembra molto utile)
  transactions.forEach((tx) => {
    const item = document.createElement("div");
    item.classname = "transaction-item";
    item.innerHTML = '<span class="tx-name">${tx.name}</span>';
    item.innerHTML = '<span class="tx-amount">${tx.amount}</span>';
    item.innerHTML = '<span class="tx-type">${tx.type}</span>';
    elencoTransazioni.appendChild(item);
  });

  //penultima funzione, aganciare destra con cartella (sinistra e destra finalmente fatto)
  cartBilDestra.appendChild(elencoTransazioni);
  cartellaBilancio.appendChild(cartBilDestra);

  //agganciare tutto sulla cartella di bilancio
  wrapperBilancio.appendChild(cartellaBilancio);
}

// Funzione per creare un grafico a torta con gradienti
//vettore tariffe orarie ricevute dall'API
let vettoreDati = [];
let vettoreColori = [];
inviaRichiesta("GET", "/db-events").then((response) => {
  response.data.forEach((element) => {
    vettoreDati.push(Number(element.tariffa_oraria));
    vettoreColori.push(element.color);
  });
  const somma = vettoreDati.reduce((acc, val) => acc + val, 0);
  const datoPercentuale = vettoreDati.map((val) => (val / somma) * 100);

  const grafico = document.getElementById("grafico");
  CreaGrafico(grafico, datoPercentuale, vettoreColori);
});
const CreaGrafico = (grafico, vettoreDati, vettoreColori) => {
  if (vettoreDati.length !== vettoreColori.length) {
    console.warn("Il numero di dati e colori è diverso");
  }

  const angoli = vettoreDati.map((val) => (val / 100) * 360);

  const OFFSET_GRAFICO = 0;
  let angoloIniziale = 0 + OFFSET_GRAFICO;

  const fasiGradient = angoli.map((angle, i) => {
    const angoloFinale = angoloIniziale + angle;
    const inizioPercent = (angoloIniziale / 360) * 100;
    const finePercent = (angoloFinale / 360) * 100;
    angoloIniziale = angoloFinale;

    return `${vettoreColori[i % vettoreColori.length]
      } ${inizioPercent}% ${finePercent}%`;
  });

  const gradient = `conic-gradient(${fasiGradient.join(", ")})`;

  if (!grafico) return;

  grafico.style.background = gradient;
  grafico.style.borderRadius = "50%";
};
//
//
//
//
//
//
// Crea nuovo filtro
const filtro = document.createElement("div");
filtro.className = "elementoFiltroBilancio";
filtro.innerHTML = `<div class="pallinoFiltro" style="background:${colore};"></div>
        <span class="spanFiltro">${nome}</span>`;
divBilancioFiltri.prepend(filtro);
aggiungiListenerFiltro(filtro); // <-- aggiungi subito il listener!
// Evidenzia eventi e filtro al click e hover
const filtri = document.querySelectorAll(".elementoFiltroBilancio");

filtri.forEach((filtro) => {
  // Evidenzia eventi al click sul filtro
  filtro.addEventListener("click", function () {
    const nomeFiltro = filtro.querySelector(".spanFiltro").innerText.trim();

    // Rimuovi evidenziazione da tutti gli eventi
    document.querySelectorAll(".fc-event").forEach((ev) => {
      ev.classList.remove("evento-evidenziato");
    });

    // Evidenzia solo quelli con lo stesso nome_cliente
    document.querySelectorAll(".fc-event").forEach((ev) => {
      const title = ev.querySelector(".fc-event-title")?.innerText || "";
      if (title.includes(nomeFiltro)) {
        ev.classList.add("evento-evidenziato");
      }
    });

    // Evidenzia il filtro selezionato
    filtri.forEach((f) => f.classList.remove("filtro-evidenziato"));
    filtro.classList.add("filtro-evidenziato");
  });

  // Hover: evidenzia filtro
  filtro.addEventListener("mouseenter", function () {
    filtro.classList.add("filtro-hover");
  });
  filtro.addEventListener("mouseleave", function () {
    filtro.classList.remove("filtro-hover");
  });
});

// Funzione per mostrare/nascondere il bottone "Deseleziona filtro"
const btnDeseleziona = document.getElementById("btn-deseleziona-filtro");
function aggiornaBottoneDeseleziona() {
  const almenoUnoSelezionato = Array.from(
    document.querySelectorAll(".elementoFiltro")
  ).some((f) => f.classList.contains("filtro-evidenziato"));
  if (btnDeseleziona) {
    btnDeseleziona.classList.toggle("visibile", almenoUnoSelezionato);
  }
}
if (btnDeseleziona) {
  btnDeseleziona.addEventListener("click", function () {
    document
      .querySelectorAll(".fc-event")
      .forEach((ev) => ev.classList.remove("evento-evidenziato"));
    document
      .querySelectorAll(".elementoFiltro")
      .forEach((f) => f.classList.remove("filtro-evidenziato"));
    aggiornaBottoneDeseleziona();
  });
}

// Funzione per aggiungere i listener a un filtro
function aggiungiListenerFiltro(filtro) {
  filtro.addEventListener("click", function () {
    const nomeFiltro = filtro.querySelector(".spanFiltro").innerText.trim();
    document
      .querySelectorAll(".fc-event")
      .forEach((ev) => ev.classList.remove("evento-evidenziato"));
    document.querySelectorAll(".fc-event").forEach((ev) => {
      const title = ev.querySelector(".fc-event-title")?.innerText || "";
      if (title.includes(nomeFiltro)) {
        ev.classList.add("evento-evidenziato");
      }
    });
    document
      .querySelectorAll(".elementoFiltro")
      .forEach((f) => f.classList.remove("filtro-evidenziato"));
    filtro.classList.add("filtro-evidenziato");
    aggiornaBottoneDeseleziona();
  });
  filtro.addEventListener("mouseenter", function () {
    filtro.classList.add("filtro-hover");
  });
  filtro.addEventListener("mouseleave", function () {
    filtro.classList.remove("filtro-hover");
  });
}

// Funzione per creare un filtro solo se non esiste già
function creaFiltroSeNonEsiste(nome, colore = "#a9f5c1") {
  const esiste = Array.from(
    document.querySelectorAll(".elementoFiltro .spanFiltro")
  ).some((span) => span.innerText.trim() === nome.trim());
  if (esiste) return;
  const filtro = document.createElement("div");
  filtro.className = "elementoFiltro";
  filtro.innerHTML = `<div class="pallino" style="background:${colore};"></div>
      <span class="spanFiltro">${nome}</span>`;
  document.querySelector(".containerFiltri").prepend(filtro);
  aggiungiListenerFiltro(filtro);
}

// Applica i listener ai filtri già presenti
document.querySelectorAll(".elementoFiltro").forEach(aggiungiListenerFiltro);

// Crea i filtri dagli eventi del backend
inviaRichiesta("GET", "/db-events")
  .then((ris) => {
    const eventi = ris.data || ris;
    const nomiFiltriCreati = new Set();
    eventi.forEach((ev) => {
      const nome = ev.title || ev.nome_cliente || "";
      if (nome && !nomiFiltriCreati.has(nome)) {
        creaFiltroSeNonEsiste(nome, ev.color || "#a9f5c1");
        nomiFiltriCreati.add(nome);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });

function creaFiltroSeNonEsiste(nome, colore = "#a9f5c1") {
  // Controlla se esiste già un filtro con questo nome
  const esiste = Array.from(
    document.querySelectorAll(".elementoFiltro .spanFiltro")
  ).some((span) => span.innerText.trim() === nome.trim());
  if (esiste) return;
  // Crea nuovo filtro
  const filtro = document.createElement("div");
  filtro.className = "elementoFiltro";
  filtro.innerHTML = `<div class="pallino" style="background:${colore};"></div>
    <span class="spanFiltro">${nome}</span>`;
  document.querySelector(".containerFiltri").prepend(filtro);
  aggiungiListenerFiltro(filtro);
}

inviaRichiesta("GET", "/db-events")
  .then((ris) => {
    // Crea filtri unici per ogni nome evento
    const eventi = ris.data || ris; // dipende da come arriva la risposta
    const nomiFiltriCreati = new Set();
    eventi.forEach((ev) => {
      const nome = ev.title || ev.nome_cliente || "";
      if (nome && !nomiFiltriCreati.has(nome)) {
        creaFiltroSeNonEsiste(nome, ev.color || "#a9f5c1");
        nomiFiltriCreati.add(nome);
      }
    });
    console.log(ris.data);
  })
  .catch((err) => {
    console.error(err);
  });
//
//
//
//
//
//
// Make transactions globally accessible
/*const transactions = [];
inviaRichiesta("GET", "/db-events")
  .then((ris) => {
    const eventi = ris.data || ris;
    transactions = eventi.map((ev) => ({
      name: ev.title || ev.nome_cliente || "",
      amount: ev.importo || "€0.00",
      type: ev.tipo || "Da Cont.",
    }));
    console.log(transactions);
  })
  .catch((err) => {
    console.error(err);
  });*/

/*const transactions = [
  { name: "Ezra Federico", amount: "€45.00", type: "Da Cont." },
  { name: "Ezra Federico", amount: "€45.00", type: "Da Cont." },
  { name: "Marco Delfinis", amount: "€45.00", type: "Da Cont." },
  { name: "Mario Rossi", amount: "€45.00", type: "Da Cont." },
  { name: "Mario Rossi", amount: "€45.00", type: "Contab." },
];*/

// sostisuisce con transactions ricevute dall'API
function renderTransactions(eventi) {
  const lista = document.querySelector(".listaBil");
  lista.innerHTML = ""; // Clear existing
  eventi.forEach((ev) => {
    const div = document.createElement("div");
    div.className = "transazioneOgetto";
    div.innerHTML = `
      <div class="transazionePallino1"></div>
      <span class="transazioneNome">${ev.title || ev.nome_cliente || ""}</span>
      <span class="transazioneEntrata">${ev.importo || ev.tariffa_oraria ? "€" + (ev.importo || ev.tariffa_oraria) : ""}</span>
      <span class="transazioneStato">${ev.tipo || "Da Cont."}</span>
      <button class="deleteTransazione" data-id="${ev.id}">Elimina</button>
    `;
    lista.appendChild(div);
  });

  function getTransactionTotal(transactions) {
    // Parse amounts, remove euro sign and commas, convert to float
    return transactions.reduce((sum, tx) => {
      let amt = parseFloat(String(tx.amount).replace(/[^\d.-]+/g, ""));
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }

  function updateGraphTotal(transactions) {
    const total = getTransactionTotal(transactions);
    const graficoTotal = document.getElementById("grafico-total");
    if (graficoTotal) {
      graficoTotal.textContent = `€${total.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Initial call
    updateGraphTotal(transactions);
  });

  // GET
  function fetchAndRenderTransactions() {
    inviaRichiesta("GET", "/db-events")
      .then((ris) => {
        const eventi = ris.data || ris;
        renderTransactions(eventi);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // DELETE
  document.querySelectorAll(".deleteTransazione").forEach((btn) => {
    btn.onclick = function () {
      const id = this.getAttribute("data-id");
      if (confirm("Eliminare questa transazione?")) {
        inviaRichiesta("DELETE", `/db-events/${id}`)
          .then(() => fetchAndRenderTransactions())
          .catch((err) => alert("Errore durante l'eliminazione"));
      }
    };
  });
}

// scarica pagina bilancio
document.addEventListener("DOMContentLoaded", fetchAndRenderTransactions);

// POST
document.getElementById("salva-evento").onclick = function (e) {
  e.preventDefault();
  const nome = document.getElementById("nome-evento").value;
  const orarioInizio = document.getElementById("orario-inizio-evento").value;
  const orarioFine = document.getElementById("orario-fine-evento").value;
  const colore = document.getElementById("colore-evento").value;

  const nuovoEvento = {
    title: nome,
    start: orarioInizio,
    end: orarioFine,
    color: colore,
  };

    inviaRichiesta("POST", "/db-events", nuovoEvento)
    .then(() => {
      fetchAndRenderTransactions();
      document.getElementById("modal-evento").close();
    })
    .catch((err) => alert("Errore durante il salvataggio"));
    
  };