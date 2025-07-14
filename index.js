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
    } else if (window.location.pathname.endsWith("activities.html")) {
      page = "attività";
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

const FormattaData = (data) => {
  const anno = data.getFullYear();
  const mese = String(data.getMonth() + 1).padStart(2, "0");
  const giorno = String(data.getDate()).padStart(2, "0");

  const ore = String(data.getHours()).padStart(2, "0");
  const minuti = String(data.getMinutes()).padStart(2, "0");
  const secondi = String(data.getSeconds()).padStart(2, "0");

  return `${anno}-${mese}-${giorno} ${ore}:${minuti}:${secondi}`;
};

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
      box.style.maxWidth = "25rem";

      // Genera dinamicamente i dettagli dell'evento
      let dettagli = `<strong style="font-size:2rem;">${info.event.title}</strong><br><br>`;
      dettagli += `<div class="dettaglioEvento"><span><b>Inizio:</b> ${
        info.event.start?.toLocaleString() || ""
      }</span></div>`;
      if (info.event.end) {
        dettagli += `<div class="dettaglioEvento"><span><b>Fine:</b> ${info.event.end.toLocaleString()}</span></div>`;
      }

      // Mostra tutte le proprietà di extendedProps

      if (info.event.extendedProps) {
        for (const [key, value] of Object.entries(info.event.extendedProps)) {
          if (value !== null && value !== undefined && value !== "") {
            const label = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            let displayValue = value;
            if (key === "tariffa_oraria") {
              displayValue = value + " €/h";
            }
            if (key === "rivalsa_inps") {
              displayValue = value ? "Sì" : "No";
            }
            dettagli += `<div class="dettaglioEvento"><span><b>${label}:</b> ${displayValue}</span></div>`;
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
          inviaRichiesta(
            "DELETE",
            `/db-events/${info.event.id}`
          )
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
        document.removeEventListener("mousedown", handleClickOutside);
      };

      // Chiudi il box al click all'esterno
      function handleClickOutside(e) {
        if (!box.contains(e.target)) {
          box.remove();
          document.removeEventListener("mousedown", handleClickOutside);
          document.removeEventListener("keydown", handleBackspace);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      // Ricordati di rimuovere anche questo listener quando chiudi con il bottone
      document.getElementById("chiudi-popup-evento").onclick = () => {
        box.remove();
        document.removeEventListener("keydown", handleBackspace);
        document.removeEventListener("mousedown", handleClickOutside);
      };

      document.getElementById("elimina-evento").onclick = () => {
        if (confirm("Sei sicuro di voler eliminare questo evento?")) {
          inviaRichiesta(
            "DELETE",
            `/db-events/${info.event.id}`
          )
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
        document.removeEventListener("mousedown", handleClickOutside);
      };
      // Previeni navigazione
      info.jsEvent.preventDefault();
    },

    eventSources: {
      url: `${_URL}/db-events`,
    },
    eventContent: (args) => {
      const colore = args.backgroundColor;
      const { event } = args;
      const { title, start, end, extendedProps } = event;
      const { descrizione_attivita } = extendedProps || {};

      const cont = document.createElement("div");
      cont.className = "event-content";
      cont.style.setProperty("--colore-attivita", colore);
      cont.setAttribute("data-attivita", descrizione_attivita ?? "");

      const ora = document.createElement("div");
      ora.className = "event-time";
      ora.textContent = start.toLocaleTimeString([], {
        hour: "2-digit",
      });

      const titolo = document.createElement("div");
      titolo.classList.add("titolo-evento");
      titolo.innerText = title;

      cont.append(ora, titolo);

      return {
        domNodes: [cont],
      };
    },
    eventDrop: function (info) {
      if (confirm("Sei sicuro di voler spostare questo evento?")) {
        inviaRichiesta("PUT", `/db-events/${info.event.id}`, {
          start: FormattaData(info.event.start),
          end: info.event.end ? FormattaData(info.event.end) : null,
        })
          .then(() => {
            calendar.refetchEvents();
          })
          .catch((err) => {
            alert("Errore durante l'aggiornamento dell'evento!");
            info.revert();
          });
      } else {
        info.revert();
      }
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
  let attivitaID = 0; // Inizializza l'ID dell'attività
  if (btnEvent[0] && btnEvent[1] && modal) {
    btnEvent[0].onclick = () => {
      nomeInput.value = "";
      orarioInizioInput.value = "";
      orarioFineInput.value = "";
      modal.showModal();
    };
    btnEvent[1].onclick = () => {
      nomeInput.value = "";
      orarioInizioInput.value = "";
      orarioFineInput.value = "";
      modal.showModal();
    };

    //Importa e setta le attività nella tendina attività
    const attivitaSelect = document.getElementById("attivita-evento");
    if (attivitaSelect) {
      inviaRichiesta("GET", "/db-attivita")
        .then((ris) => {
          const attivita = ris.data || ris;
          attivita.forEach((attivita) => {
            const option = document.createElement("option");
            option.value = attivita.ID + "- " + attivita.Descrizione;
            option.textContent = attivita.ID + "- " + attivita.Descrizione;
            attivitaSelect.appendChild(option);
          });
        })
        .catch((err) => {
          console.error(err);
          alert("Errore durante il caricamento delle attività.");
        });
    }
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
      const ripetizione = document.getElementById("ripetizione-evento").value;

      if (!nome) return alert("Inserisci un nome all'evento!");
      if (!orarioInizio)
        return alert("Inserisci un orario di inizio all'evento!");
      /* MAGARI SERVE MAGARI NO, BOH 
      // Crea nuovo filtro
      const filtro = document.createElement("div");
      filtro.className = "elementoFiltro";
      filtro.innerHTML = `<div class="pallino" style="background:${colore};"></div>
        <span class="spanFiltro">${nome}</span>`;
      containerFiltri.prepend(filtro);
      aggiungiListenerFiltro(filtro); // <-- aggiungi subito il listener!
      */
      attivitaID = document.getElementById("attivita-evento").value[0]; // Prendi l'ID dell'attività selezionata
      const nuovoEvento = {
        start: orarioInizioInput.value,
        end: orarioFineInput.value,
        title: nome,
        nome_cliente: document.getElementById("nome-cliente-evento").value,
        descrizione_evento: document.getElementById("descrizione-evento").value,
        id_attivita: attivitaID, // <-- ID dell'attività selezionata
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

      // Evidenzia solo quelli con la stessa attività
      document.querySelectorAll(".fc-event").forEach((ev) => {
        const attivita = ev.getAttribute("data-attivita") || "";
        if (attivita.includes(nomeFiltro)) {
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
      const ev = [...document.querySelectorAll(".fc-event")].map(
        (e) => e.children[0]
      );

      ev.filter((evento) => {
        const attivita = evento.getAttribute("data-attivita") || "";
        return attivita.toLocaleLowerCase() === nomeFiltro.toLocaleLowerCase();
      }).forEach((evento) => {
        evento.parentElement.classList.add("evento-evidenziato");
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
  inviaRichiesta("GET", "/db-attivita")
    .then((ris) => {
      const eventi = ris.data || ris;
      const nomiFiltriCreati = new Set();
      eventi.forEach((ev) => {
        const nome = ev.Descrizione || "";
        if (nome && !nomiFiltriCreati.has(nome)) {
          creaFiltroSeNonEsiste(nome, ev.Colore || "#a9f5c1");
          nomiFiltriCreati.add(nome);
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
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

inviaRichiesta("GET", "/db-attivita")
  .then((ris) => {
    // Crea filtri unici per ogni attività
    const eventi = ris.data || ris; // dipende da come arriva la risposta
    const nomiFiltriCreati = new Set();
    eventi.forEach((ev) => {
      const nome = ev.Descrizione || "";
      if (nome && !nomiFiltriCreati.has(nome)) {
        creaFiltroSeNonEsiste(nome, ev.Colore || "#a9f5c1");
        nomiFiltriCreati.add(nome);
      }
    });
    console.log(ris.data);
  })
  .catch((err) => {
    console.error(err);
  });
