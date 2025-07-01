//Inizializzazione del codice JavaScript
// Questo codice viene eseguito quando la pagina è completamente caricata.
window.addEventListener("load", init);

const c = console.log;

function init() {
  // Inizializza il menu hamburger
  const tendinaHamburger =
    document.getElementsByClassName("tendinaHamburger")[0];
  if (tendinaHamburger) {
    tendinaHamburger.style.display = "none"; // Nascondi la tendina all'inizio
  }
  // Inizializza tendina filtri
  const containerFiltri = document.getElementsByClassName("containerFiltri")[0];
  if (containerFiltri) {
    containerFiltri.style.display = "none"; // Nascondi i filtri all'inizio
  }

  // Inizializza variabile navigazione pagine
  let nPagina = 1;
}

//FUNZIONE SALUTO
// Questa funzione mostra un saluto in base all'ora corrente.
window.addEventListener("load", saluto);

function saluto() {
  const ora = new Date().getHours();
  let saluto = document.getElementsByClassName("spanSaluto")[0];

  if (ora >= 5 && ora <= 12) {
    saluto.innerText = "Buongiorno ☀️";
  } else if (ora >= 13 && ora <= 19) {
    saluto.innerText = "Buon pomeriggio ☀️";
  } else {
    saluto.innerText = "Buona sera 🌙";
  }
}

window.addEventListener("DOMContentLoaded", function () {
  selezioneElementoHamburger();
});

//FUNZIONE MENU HAMBURGER

function tendinaHamburger() {
  const tendinaHamburger =
    document.getElementsByClassName("tendinaHamburger")[0];

  if (tendinaHamburger.style.display === "block") {
    tendinaHamburger.style.display = "none";
  } else {
    tendinaHamburger.style.display = "block";
  }
}

//FUNZIONE SELEZIONE ELEMENTO HAMBURGER
// Questa funzione gestisce la selezione di un elemento nel menu hamburger.
function selezioneElementoHamburger(e) {
  // Se l'evento è passato (click), usa il target, altrimenti seleziona in base alla pagina
  let page;
  if (e && e.currentTarget) {
    page = e.currentTarget.getAttribute("data-page");
  } else {
    // Determina la pagina attuale dall'URL
    if (window.location.pathname.endsWith("index.html")) {
      page = "calendario";
    } else if (window.location.pathname.endsWith("bilancio.html")) {
      page = "bilancio";
    } else if (window.location.pathname.endsWith("fatture.html")) {
      page = "fatture";
    }
  }

  const ElementoHamburger = document.getElementsByClassName(
    "divElementoHamburger"
  );
  Array.from(ElementoHamburger).forEach((elemento) => {
    if (elemento.getAttribute("data-page") === page) {
      elemento.classList.add("elementoSelezionato");
    } else {
      elemento.classList.remove("elementoSelezionato");
    }
  });
}

//FUNZIONE APERTURA FILTRI
// Questa funzione mostra o nasconde la tendina dei filtri.
function aperturaFiltri() {
  const containerFiltri = document.getElementsByClassName("containerFiltri")[0];

  if (containerFiltri.style.display === "flex") {
    containerFiltri.style.display = "none";
  } else {
    containerFiltri.style.display = "flex";
  }
}

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

  //esempio di data preso online (la struttura, il resto ho messo per comodita di vedere paragonandola con la Figma)
  const transactions = [
    { name: "Mario Rossi", amount: "€45.00", type: "Da Cont." },
    { name: "ITS Accade...", amount: "€128.00", type: "Da Cont." },
    { name: "Corso Onlin...", amount: "€235.00", type: "Corrib." },
    { name: "Mario Rossi", amount: "€45.00", type: "Da Cont." },
    { name: "Corso Onlin...", amount: "€100.00", type: "Corrib." },
    { name: "ITA Accade...", amount: "€90.00", type: "Corrib." },
  ];

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

// Gestione della navigazione tra le pagine
if (window.location.pathname === "./Innuma/index.html") {
  nPagina = 1;
  selezioneElementoHamburger();
} else if (window.location.pathname === "./Innuma/bilancio.html") {
  nPagina = 2;
  selezioneElementoHamburger();
}

//Inizializzazione del calendario
document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "450px",
    locale: "it",
  });

  calendar.render();
});
