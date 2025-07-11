// Pagina Bilancio dinamica
function BalancePage() {
  //la cartella dove mettiamo tutte i contenuti della pagina bilancio
  const wrapperBilancio = document.createElement("div");
  wrapperBilancio.className = "contenitoreBilancio";

  //la cartella per il chart e transazioni
  const cartellaBilancio = document.createElement("div");
  cartellaBilancio.className = "cartellaBilancio";

  //parte chart
  const cartBilSinistra = document.createElement("div");
  cartBilSinistra.className = "cartellaSinitra";

  //filtri sotto il chart
  const contenutoFiltri = document.createElement("div");
  contenutoFiltri.className = "contFiltri";
  // I filtri saranno creati dinamicamente più sotto
  cartBilSinistra.appendChild(contenutoFiltri);

  //bottone per entrata e uscita
  const entraUscita = document.createElement("button");
  entraUscita.textContent = "Entrate/Uscite";
  entraUscita.className = "btnEntUsc";
  cartBilSinistra.appendChild(entraUscita);

  cartellaBilancio.appendChild(cartBilSinistra);

  //parte transazioni
  const cartBilDestra = document.createElement("div");
  cartBilDestra.className = "cartellaDestra";

  const titolo = document.createElement("h1");
  titolo.textContent = "Transazioni";
  titolo.className = "headerTransazione";
  cartBilDestra.appendChild(titolo);

  const elencoTransazioni = document.createElement("div");
  elencoTransazioni.className = "listaTrans";
  cartBilDestra.appendChild(elencoTransazioni);
  cartellaBilancio.appendChild(cartBilDestra);
  wrapperBilancio.appendChild(cartellaBilancio);

  document.body.appendChild(wrapperBilancio);

  // Funzione per creare filtri dinamici
  function creaFiltroSeNonEsiste(nome, colore = "#a9f5c1") {
    const esiste = Array.from(
      contenutoFiltri.querySelectorAll(".elementoFiltro .spanFiltriBil")
    ).some((span) => span.innerText.trim() === nome.trim());
    if (esiste) return;
    const filtro = document.createElement("div");
    filtro.className = "elementoFiltro";
    filtro.innerHTML = `<div class=\"pallino\" style=\"background:${colore};\"></div><span class=\"spanFiltriBil\">${nome}</span>`;
    contenutoFiltri.appendChild(filtro);
    aggiungiListenerFiltro(filtro);
  }

  // Listener per filtri
  function aggiungiListenerFiltro(filtro) {
    filtro.addEventListener("click", function () {
      const nomeFiltro = filtro.querySelector(".spanFiltriBil").innerText.trim();
      document.querySelectorAll(".fc-event").forEach((ev) => ev.classList.remove("evento-evidenziato"));
      document.querySelectorAll(".fc-event").forEach((ev) => {
        const title = ev.querySelector(".fc-event-title")?.innerText || "";
        if (title.includes(nomeFiltro)) {
          ev.classList.add("evento-evidenziato");
        }
      });
      contenutoFiltri.querySelectorAll(".elementoFiltro").forEach((f) => f.classList.remove("filtro-evidenziato"));
      filtro.classList.add("filtro-evidenziato");
    });
    filtro.addEventListener("mouseenter", function () {
      filtro.classList.add("filtro-hover");
    });
    filtro.addEventListener("mouseleave", function () {
      filtro.classList.remove("filtro-hover");
    });
  }

  // Crea filtri dagli eventi del backend
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

  // Funzione per creare il grafico dinamico
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
      return `${vettoreColori[i % vettoreColori.length]} ${inizioPercent}% ${finePercent}%`;
    });
    const gradient = `conic-gradient(${fasiGradient.join(", ")})`;
    if (!grafico) return;
    grafico.style.background = gradient;
    grafico.style.borderRadius = "50%";
  };

  // Funzione per renderizzare le transazioni
  function renderTransactions(eventi) {
    elencoTransazioni.innerHTML = "";
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
      elencoTransazioni.appendChild(div);
    });
    // Calcola e mostra il totale delle transazioni
    const totale = eventi.reduce((sum, ev) => {
      const importo = ev.importo || ev.tariffa_oraria || 0;
      return sum + (typeof importo === "string" ? parseFloat(importo.replace(",", ".")) : importo);
    }, 0);
    const intestazioneTransazioni = document.createElement("div");
    intestazioneTransazioni.className = "intestazioneTransazioni";
    intestazioneTransazioni.innerHTML = `
      <span class="totaleLabel">Totale:</span>
      <span class="totaleValore">€${totale.toFixed(2).replace(".", ",")}</span>
    `;
    elencoTransazioni.prepend(intestazioneTransazioni);

    // Aggiungi listener per i pulsanti di eliminazione
    document.querySelectorAll(".deleteTransazione").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idTransazione = this.getAttribute("data-id");
        if (confirm("Sei sicuro di voler eliminare questa transazione?")) {
          inviaRichiesta("DELETE", `/db-events/${idTransazione}`)
            .then(() => {
              fetchAndRenderTransactions();
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    });
  }

  // Scarica e mostra le transazioni
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
  document.addEventListener("DOMContentLoaded", fetchAndRenderTransactions);

  // POST nuovo evento
  const salvaEventoBtn = document.getElementById("salva-evento");
  if (salvaEventoBtn) {
    salvaEventoBtn.onclick = function (e) {
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
  }
}