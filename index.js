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
var calendar;
document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    aspectRatio: 2,
    expandRows: true,
    locale: "it",
    headerToolbar: {
      left: "prev today next",
      center: "title",
      right: "dayGridMonth timeGridWeek timeGridDay listWeek",
    },
    buttonIcons: {
      prev: "chevrons-left",
      next: "chevrons-right",
    },
    allDaySlot: false,
    slotDuration: "01:00:00",
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      omitZeroMinute: true,
      meridiem: "short",
    },
    navLinks: true,
    editable: true,
    nowIndicator: true,
    slotMinTime: "08:00",
    slotMaxTime: "22:00",
    buttonText: {
      today: "Oggi",
      month: "Mese",
      week: "Settimana",
      day: "Giorno",
      list: "Lista",
    },
    eventClick: function (info) {
      // Rimuovi eventuali box già presenti
      const oldBox = document.getElementById("popup-evento");
      if (oldBox) oldBox.remove();

      // Crea il box
      const box = document.createElement("div");
      box.id = "popup-evento";
      box.style.position = "absolute";
      box.style.zIndex = 9999;
      box.style.background = "#fff";
      box.style.border = "1px solid #ccc";
      box.style.borderRadius = "10px";
      box.style.padding = "1rem";
      box.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
      box.style.minWidth = "200px";
      box.innerHTML = `
    <strong>${info.event.title}</strong><br>
    <br>
    <span><b>Inizio:</b> ${info.event.start.toLocaleString()}</span><br>
    ${
      info.event.end
        ? `<span><b>Fine:</b> ${info.event.end.toLocaleString()}</span><br>`
        : ""
    }
    ${
      info.event.extendedProps && info.event.extendedProps.descrizione
        ? `<span><b>Descrizione:</b> ${info.event.extendedProps.descrizione}</span>`
        : ""
    }
    <div id="divbtnPopupEvento">
    <button id="elimina-evento"><img id="imgPopupEvent" src="./assets/delete.png" alt="Elimina evento"></button>
      <button id="chiudi-popup-evento"><img id="imgPopupEvent" src="./assets/indietro.png" alt="Chiudi popup"></button>
    </div>
  `;

      // Posiziona il box vicino al click
      box.style.left = info.jsEvent.pageX + 10 + "px";
      box.style.top = info.jsEvent.pageY + 10 + "px";

      document.body.appendChild(box);

      // Chiudi il box al click su "Chiudi"
      document.getElementById("chiudi-popup-evento").onclick = () =>
        box.remove();

      // Elimina l'evento al click su "Elimina"
      document.getElementById("elimina-evento").onclick = () => {
        if (confirm("Sei sicuro di voler eliminare questo evento?")) {
          inviaRichiesta("DELETE", `/events/${info.event.id}`)
            .then((ris) => {
              console.log(ris);
              box.remove(); // Rimuovi il box popup
              calendar.refetchEvents(); // Ricarica gli eventi
            })
            .catch((err) => {
              console.error(err);
              alert("Errore durante l'eliminazione dell'evento.");
            });
        }
      };

      // Previeni navigazione
      info.jsEvent.preventDefault();
    },

    eventSources: {
      url: `${_URL}/events`,
    },
  });
  calendar.render();
});

document.addEventListener("DOMContentLoaded", function () {
  const btnEvent = [...document.querySelectorAll(".bottoneCreaElemento")];
  const modal = document.getElementById("modal-evento");
  const chiudi = document.getElementById("chiudi-modal-evento");
  const salva = document.getElementById("salva-evento");
  const nomeInput = document.getElementById("nome-evento");
  const orarioInizioInput = document.getElementById("orario-inizio-evento");
  const orarioFineInput = document.getElementById("orario-fine-evento");
  const coloreInput = document.getElementById("colore-evento");
  const containerFiltri = document.querySelector(".containerFiltri");

  orarioInizioInput.addEventListener("change", () => {
    if (orarioInizioInput.value != "") {
      const [giorno, oreStringa] = orarioInizioInput.value.split("T");
      const [ore, minuti] = oreStringa.split(":");

      const oreAggiunte = (+ore + 1) % 24;
      const stringaAggiunta =
        giorno + "T" + (oreAggiunte + "").padStart(2, "0") + ":" + minuti;
      orarioFineInput.value = stringaAggiunta;
    }
  });

  if (btnEvent[0] && btnEvent[1] && modal) {
    btnEvent[0].onclick = () => {
      nomeInput.value = "";
      orarioInizioInput.value = "";
      orarioFineInput.value = "";
      coloreInput.value = "#a9f5c1";
      modal.showModal();
    };
    btnEvent[1].onclick = () => {
      nomeInput.value = "";
      orarioInizioInput.value = "";
      orarioFineInput.value = "";
      coloreInput.value = "#a9f5c1";
      modal.showModal();
    };
  }

  if (chiudi && modal) {
    chiudi.onclick = () => {
      modal.close();
    };
  }
  if (salva && containerFiltri) {
    salva.onclick = (e) => {
      e.preventDefault();
      const nome = nomeInput.value.trim();
      const orarioInizio = orarioInizioInput.value;
      const colore = coloreInput.value;
      if (!nome) return alert("Inserisci un nome all'evento!");
      if (!orarioInizio)
        return alert("Inserisci un orario di inizio all'evento!");
      // Crea nuovo filtro
      const filtro = document.createElement("div");
      filtro.className = "elementoFiltro";
      filtro.innerHTML = `<div class="pallino" style="background:${colore};"></div>
        <span class="spanFiltro">${nome}</span>`;
      containerFiltri.prepend(filtro);
      const nuovoEvento = {
        title: nome,
        start: orarioInizioInput.value,
        end: orarioFineInput.value,
        color: colore,
      };

      inviaRichiesta("POST", "/events", nuovoEvento)
        .then((ris) => {
          console.log(ris);
          modal.close();
          calendar.refetchEvents();
        })
        .catch((err) => {
          console.error(err);
          modal.close();
        });
    };
  }
});

inviaRichiesta("GET", "/events")
  .then((ris) => {
    console.log(ris.data);
  })
  .catch((err) => {
    console.error(err);
  });
