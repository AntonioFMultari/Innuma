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

      // Genera dinamicamente i dettagli dell'evento
      let dettagli = `<strong>${info.event.title}</strong><br><br>`;
      dettagli += `<span><b>Inizio:</b> ${
        info.event.start?.toLocaleString() || ""
      }</span><br>`;
      if (info.event.end) {
        dettagli += `<span><b>Fine:</b> ${info.event.end.toLocaleString()}</span><br>`;
      }

      // Mostra tutte le proprietà di extendedProps
      if (info.event.extendedProps) {
        for (const [key, value] of Object.entries(info.event.extendedProps)) {
          if (value !== null && value !== undefined && value !== "") {
            dettagli += `<span><b>${key}:</b> ${value}</span><br>`;
          }
        }
      }

      dettagli += `
  <div id="divbtnPopupEvento" style="margin-top:1rem;">
    <button id="elimina-evento"><img id="imgPopupEvent" src="./assets/delete.png" alt="Elimina evento"></button>
    <button id="chiudi-popup-evento"><img id="imgPopupEvent" src="./assets/indietro.png" alt="Chiudi popup"></button>
  </div>
`;

      box.innerHTML = dettagli;

      // Posiziona il box vicino al click
      //Condizione per evitare che il box esca dallo schermo
      const boxWidth = 200; // Larghezza del box
      const boxHeight = 150; // Altezza del box
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      if (info.jsEvent.pageX + boxWidth > screenWidth) {
        box.style.left = screenWidth - boxWidth - 15 + "px"; // Posiziona a destra
      } else {
        box.style.left = info.jsEvent.pageX - 15 + "px"; // Posiziona a sinistra
      }
      if (info.jsEvent.pageY + boxHeight > screenHeight) {
        box.style.top = screenHeight - boxHeight - 15 + "px"; // Posiziona in basso
      } else {
        box.style.top = info.jsEvent.pageY - 15 + "px"; // Posiziona in alto
      }

      document.body.appendChild(box);

      // Gestione eliminazione con Backspace
      function handleBackspace(e) {
        if (e.key === "Backspace") {
          if (document.body.contains(box)) {
            if (confirm("Sei sicuro di voler eliminare questo evento?")) {
              inviaRichiesta("DELETE", `/db-events/${info.event.id}`)
                .then((ris) => {
                  console.log(ris);
                  box.remove();
                  calendar.refetchEvents();
                })
                .catch((err) => {
                  console.error(err);
                  alert("Errore durante l'eliminazione dell'evento.");
                });
            }
          }
        }
      }
      document.addEventListener("keydown", handleBackspace);

      // Chiudi il box al click su "Chiudi"
      document.getElementById("chiudi-popup-evento").onclick = () => {
        box.remove();
        document.removeEventListener("keydown", handleBackspace);
      };

      // Elimina l'evento al click su "Elimina"
      document.getElementById("elimina-evento").onclick = () => {
        if (confirm("Sei sicuro di voler eliminare questo evento?")) {
          inviaRichiesta("DELETE", `/db-events/${info.event.id}`)
            .then((ris) => {
              console.log(ris);
              box.remove();
              calendar.refetchEvents();
            })
            .catch((err) => {
              console.error(err);
              alert("Errore durante l'eliminazione dell'evento.");
            });
        }
        document.removeEventListener("keydown", handleBackspace);
      };
      // Previeni navigazione
      info.jsEvent.preventDefault();
    },

    eventSources: {
      url: `${_URL}/db-events`,
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
      const rivalsa_inps = document.getElementById("rivalsa-inps-evento")
        .checked
        ? 1
        : 0;
      const ripetizione = document.getElementById("ripetizione-evento").value;

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
        nome_cliente: document.getElementById("nome-cliente-evento").value, // <-- input testo
        tariffa_oraria: Number(
          document.getElementById("tariffa-oraria-evento").value
        ).toFixed(2), // <-- input numero
        descrizione_evento: document.getElementById("descrizione-evento").value, // <-- textarea
        rivalsa_inps: rivalsa_inps,
        tipo_attivita: document.getElementById("tipo-attivita-evento").value, // <-- select o input
      };

      console.log("Nuovo evento che sto per inviare:", nuovoEvento);

      const fineRipetizione = document.getElementById(
        "fine-ripetizione-evento"
      ).value;

      let eventiDaSalvare = [nuovoEvento];

      if (ripetizione !== "nessuna" && fineRipetizione) {
        let lastStart = new Date(nuovoEvento.start);
        let lastEnd = new Date(nuovoEvento.end);
        const dataFine = new Date(fineRipetizione);

        while (true) {
          let nextStart = new Date(lastStart);
          let nextEnd = new Date(lastEnd);
          switch (ripetizione) {
            case "giornaliera":
              nextStart.setDate(nextStart.getDate() + 1);
              nextEnd.setDate(nextEnd.getDate() + 1);
              break;
            case "settimanale":
              nextStart.setDate(nextStart.getDate() + 7);
              nextEnd.setDate(nextEnd.getDate() + 7);
              break;
            case "mensile":
              nextStart.setMonth(nextStart.getMonth() + 1);
              nextEnd.setMonth(nextEnd.getMonth() + 1);
              break;
            case "annuale":
              nextStart.setFullYear(nextStart.getFullYear() + 1);
              nextEnd.setFullYear(nextEnd.getFullYear() + 1);
              break;
          }
          // Cambia qui: se la data è dopo la fine, esci dal ciclo
          if (nextStart > dataFine) break;
          eventiDaSalvare.push({
            ...nuovoEvento,
            start: nextStart.toISOString().slice(0, 16),
            end: nextEnd.toISOString().slice(0, 16),
          });
          lastStart = nextStart;
          lastEnd = nextEnd;
        }
      }

      // Salva tutti gli eventi (uno alla volta)
      Promise.all(
        eventiDaSalvare.map((ev) => inviaRichiesta("POST", "/db-events", ev))
      )
        .then((ris) => {
          modal.close();
          calendar.refetchEvents();
        })
        .catch((err) => {
          console.error(err);
          modal.close();
        });
    };
  }

  const ripetizioneSelect = document.getElementById("ripetizione-evento");
  const labelFineRipetizione = document.getElementById(
    "label-fine-ripetizione"
  );

  if (ripetizioneSelect && labelFineRipetizione) {
    ripetizioneSelect.addEventListener("change", function () {
      if (this.value !== "nessuna") {
        labelFineRipetizione.style.display = "block";
      } else {
        labelFineRipetizione.style.display = "none";
      }
    });
  }

  // Evidenzia eventi e filtro al click e hover
  const filtri = document.querySelectorAll(".elementoFiltro");

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

  const btnDeseleziona = document.getElementById("btn-deseleziona-filtro");

  // Funzione di utilità per aggiornare la visibilità del bottone
  function aggiornaBottoneDeseleziona() {
    const almenoUnoSelezionato = Array.from(filtri).some((f) =>
      f.classList.contains("filtro-evidenziato")
    );
    if (btnDeseleziona) {
      btnDeseleziona.classList.toggle("visibile", almenoUnoSelezionato);
    }
  }

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
      aggiornaBottoneDeseleziona();
    });

    // Hover: evidenzia filtro
    filtro.addEventListener("mouseenter", function () {
      filtro.classList.add("filtro-hover");
    });
    filtro.addEventListener("mouseleave", function () {
      filtro.classList.remove("filtro-hover");
    });
  });

  if (btnDeseleziona) {
    btnDeseleziona.addEventListener("click", function () {
      // Rimuovi evidenziazione da tutti gli eventi
      document.querySelectorAll(".fc-event").forEach((ev) => {
        ev.classList.remove("evento-evidenziato");
      });
      // Rimuovi evidenziazione da tutti i filtri
      filtri.forEach((f) => f.classList.remove("filtro-evidenziato"));
      aggiornaBottoneDeseleziona();
    });
  }

  // All'avvio, assicura che il bottone sia nascosto
  aggiornaBottoneDeseleziona();
});

inviaRichiesta("GET", "/db-events")
  .then((ris) => {
    console.log(ris.data);
  })
  .catch((err) => {
    console.error(err);
  });
