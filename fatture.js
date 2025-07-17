// Questo è il tuo unico file JavaScript (es. fatture_claude.js)

// Seleziona gli elementi DOM principali una sola volta all'inizio
let anteprimaFatture = document.getElementsByClassName("anteprimaFatture")[0];
let eventCountElement = document.getElementById("eventCount"); 

// Array che conterrà gli eventi filtrati e formattati per la visualizzazione
let anteprime = [];

// --- FUNZIONI DI UTILITÀ E FORMATTAZIONE ---

// Formatta la panoramica (descrizione evento + attività)
function formatPanoramica(descrizioneEvento, descrizioneAttivita) {
  const panoramica = [];
  if (descrizioneEvento) {
    panoramica.push(descrizioneEvento);
  }
  if (descrizioneAttivita) {
    panoramica.push(descrizioneAttivita);
  }
  // Se non c'è nessuna descrizione, aggiunge un messaggio predefinito
  if (panoramica.length === 0) {
    panoramica.push("Nessuna descrizione disponibile.");
  }
  return panoramica;
}

// Formatta la data per la visualizzazione (es. "gg/mm/aaaa")
function formatDateForDisplay(dateString) {
  if (!dateString) return "Data non disponibile";
  const date = new Date(dateString);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('it-IT', options);
}

// Formatta l'intervallo di orario (es. "HH:MM - HH:MM")
function formatTimeRange(startString, endString) {
  if (!startString || !endString) return "Orario non disponibile";
  const startDate = new Date(startString);
  const endDate = new Date(endString);
  const startOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  const endOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  return `${startDate.toLocaleTimeString('it-IT', startOptions)} - ${endDate.toLocaleTimeString('it-IT', endOptions)}`;
}

// Mostra un messaggio quando non ci sono eventi
function showNoEventsMessage() {
  anteprimaFatture.innerHTML = '<p class="noEventsMessage">Nessun evento passato trovato.</p>';
  if (eventCountElement) {
    eventCountElement.textContent = "0";
  }
}

// Mostra un messaggio di errore
function showErrorMessage(errorMessage) {
  anteprimaFatture.innerHTML = `
    <div class="error-message" style="
      text-align: center; 
      padding: 40px; 
      color: #d32f2f; 
      font-size: 18px;
      border: 2px solid #d32f2f;
      border-radius: 10px;
      margin: 20px 0;
      background: #ffeaea;
    ">
      ❌ Errore di caricamento
      <br><br>
      <small style="color: #666;">${errorMessage}</small>
      <br><br>
      <button onclick="refreshEvents()" style="
        background: #d32f2f;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">🔄Check the link and retry</button>
    </div>
  `;
  if (eventCountElement) {
    eventCountElement.textContent = "Errore";
  }
}

// --- FUNZIONI PRINCIPALI DI LOGICA ---

// Funzione per caricare, filtrare e visualizzare gli eventi dal database
async function loadAndDisplayEvents() {
  try {
    console.log("🔄 Tentativo di caricamento eventi dal database...");
    
    // Effettua la chiamata al tuo endpoint API per recuperare gli eventi
    const response = await fetch('/db-events');
    console.log("📡 Response status:", response.status);
    
    if (!response.ok) {
      const errorBody = await response.text(); 
      throw new Error(`Errore HTTP: ${response.status} - ${response.statusText}. Dettagli: ${errorBody}`);
    }
    
    const events = await response.json();
    console.log("📦 Eventi ricevuti dal database (grezzi):", events);
    
    if (!Array.isArray(events)) {
      throw new Error("I dati ricevuti dall'API non sono un array valido. Controlla la risposta del server.");
    }
    
    // Ottieni la data e l'ora attuali per il filtro
    const now = new Date(); 
    console.log("🕰️ Ora attuale per il filtro:", now.toLocaleString('it-IT'));

    // Filtra gli eventi: solo quelli la cui data di fine è già passata
    const filteredEvents = events.filter(event => {
      // Controlla che event.end esista prima di provare a creare una data
      if (!event.end) {
        console.warn(`Evento con ID ${event.id} senza data di fine. Verrà escluso dal filtro.`);
        return false; 
      }
      const endDate = new Date(event.end);
      const isPastEvent = endDate <= now; 
      if (isPastEvent) {
        console.log(`✅ Evento passato: "${event.title}" (fine: ${endDate.toLocaleString('it-IT')})`);
      } else {
        console.log(`❌ Evento futuro: "${event.title}" (fine: ${endDate.toLocaleString('it-IT')})`);
      }
      return isPastEvent;
    });
    console.log("📦 Eventi filtrati (solo quelli passati):", filteredEvents);

    if (filteredEvents.length === 0) {
      console.log("⚠️ Nessun evento passato trovato nel database");
      showNoEventsMessage(); // Mostra il messaggio di nessun evento
      return; // Esce dalla funzione se non ci sono eventi da visualizzare
    }
    
    // Trasforma i dati filtrati dal database nel formato ottimizzato per il frontend (anteprime)
    anteprime = filteredEvents.map((event, index) => { 
      console.log(`🔧 Processando evento filtrato ${index + 1}:`, event);
      
      return {
        id: event.id, 
        titolo: event.title || "Evento senza titolo",
        date: formatDateForDisplay(event.start),
        nome: event.nome_cliente || "Cliente non specificato",
        panoramica: formatPanoramica(event.descrizione_evento, event.descrizione_attivita),
        orario: formatTimeRange(event.start, event.end),
        importo: event.tariffa_oraria ? parseFloat(event.tariffa_oraria).toFixed(2) : "0.00",
        color: event.color || "#000000", // Assumi che la colonna sia 'color' nel DB, altrimenti default nero
        _originalData: event // Mantiene una copia dei dati originali se servono
      };
    });
    
    console.log("✅ Dati trasformati per il frontend (finali 'anteprime'):", anteprime);
    
    createAnteprime(); // Chiama la funzione per creare e inserire i div nell'HTML
    
    // Aggiorna il conteggio degli eventi visualizzati nell'HTML
    if (eventCountElement) { 
      eventCountElement.textContent = anteprime.length; 
      console.log(`📊 Totale eventi passati visualizzati: ${anteprime.length}`);
    }

    // Se ci sono eventi, seleziona il primo e mostra i suoi dettagli
    if (anteprime.length > 0) {
      // Piccolo timeout per assicurarsi che l'HTML sia stato renderizzato
      setTimeout(() => {
        const firstAnteprimaElement = anteprimaFatture.querySelector('.anteprimaSpec');
        if (firstAnteprimaElement) {
          firstAnteprimaElement.classList.add('active'); 
          mostraSpecificaFattura(anteprime[0]); 
        }
      }, 50); // Breve ritardo
    }

  } catch (error) {
    console.error('❌ Errore nel caricamento e visualizzazione degli eventi:', error);
    showErrorMessage(error.message); // Mostra un messaggio di errore all'utente
  }
}

// Funzione per creare dinamicamente gli elementi DOM delle anteprime
function createAnteprime() {
  console.log("🎨 Creazione anteprime dinamiche...");
  anteprimaFatture.innerHTML = ''; // Pulisce il contenitore prima di aggiungere nuovi elementi
  
  anteprime.forEach((anteprimaDato, index) => {
    let anteprimaSpecElement = document.createElement("div");
    // Salva l'intero oggetto dati nell'elemento HTML per un facile recupero al click
    anteprimaSpecElement.dataset.anteprima = JSON.stringify(anteprimaDato); 
    anteprimaSpecElement.classList.add("anteprimaSpec");
    
    // Applica gli stili grid per il layout interno di ogni anteprima
    anteprimaSpecElement.style.display = "grid";
    anteprimaSpecElement.style.gridTemplateColumns = "repeat(5, 1fr)";
    anteprimaSpecElement.style.gridTemplateRows = "repeat(5, 1fr)";
    anteprimaSpecElement.style.gridColumnGap = "0rem";
    anteprimaSpecElement.style.gridRowGap = "0rem";

    // div1 - Icona freccia
    let div1 = document.createElement("div");
    div1.classList.add("div1");
    div1.style.gridArea = "1 / 1 / 6 / 2";
    let img = document.createElement("img");
    img.src = "assets/arrow_right_60dp_000000_FILL0_wght400_GRAD0_opsz48.png";
    img.alt = "Freccia";
    img.classList.add("arrowIcon");
    div1.appendChild(img);

    // div2 - Titolo dell'evento
    let div2 = document.createElement("div");
    div2.classList.add("div2");
    div2.style.gridArea = "1 / 2 / 4 / 6";
    let titolo = document.createElement("h3");
    titolo.textContent = anteprimaDato.titolo; 
    div2.appendChild(titolo);

    // div3 - Data dell'evento
    let div3 = document.createElement("div");
    div3.classList.add("div3");
    div3.style.gridArea = "4 / 2 / 6 / 4";
    let date = document.createElement("p");
    date.textContent = anteprimaDato.date; 
    div3.appendChild(date);

    // div4 - Nome del cliente
    let div4 = document.createElement("div");
    div4.classList.add("div4");
    div4.style.gridArea = "4 / 4 / 6 / 6";
    let nome = document.createElement("p");
    nome.textContent = anteprimaDato.nome; 
    div4.appendChild(nome);

    // Assembla tutti i div figli nel div principale dell'anteprima
    anteprimaSpecElement.appendChild(div1);
    anteprimaSpecElement.appendChild(div2);
    anteprimaSpecElement.appendChild(div3);
    anteprimaSpecElement.appendChild(div4);

    // Aggiungi l'event listener per il click su ogni anteprima
    anteprimaSpecElement.addEventListener("click", () => {
      console.log(`🖱️ Cliccato su evento ${index + 1}: ${anteprimaDato.titolo}`);
      
      // Rimuovi la classe 'active' da tutte le anteprime
      document.querySelectorAll('.anteprimaSpec').forEach((a) => {
        a.classList.remove("active");
      });
      
      // Aggiungi la classe 'active' solo all'elemento cliccato
      anteprimaSpecElement.classList.add("active");
      
      // Mostra i dettagli specifici dell'evento selezionato
      mostraSpecificaFattura(anteprimaDato);
    });

    // Aggiungi l'anteprima creata al contenitore generale
    anteprimaFatture.appendChild(anteprimaSpecElement);
  });

  console.log(`✅ Create ${anteprime.length} anteprime dinamiche.`);
}

// Funzione per mostrare i dettagli completi di una fattura nella sezione specificaFattura
function mostraSpecificaFattura(fattura) {
  console.log("📋 Mostrando dettagli fattura:", fattura);
  const specificaFattura = document.querySelector('.specificaFattura');
  
  // Costruisce l'HTML dinamico per la sezione di dettaglio
  specificaFattura.innerHTML = `
    <span class="dot"></span> <div class="DivTitolo">
      <span class="TitoloFattura">${fattura.titolo ?? "N/D"}</span>
      <span class="SottoTitolo">Cliente: ${fattura.nome ?? "N/D"}</span>
    </div>
    <img class="IconaPanoramica" src="assets/overview_60dp_A764BD_FILL0_wght400_GRAD0_opsz48.png" alt="Panoramica"/>
    <div class="Panoramica">
      <ul>
        ${fattura.panoramica && fattura.panoramica.length > 0 ? 
           fattura.panoramica.map(punto => `<li>${punto}</li>`).join('') : 
           "<li>Dettagli non disponibili</li>"
        }
      </ul>
    </div>
    <img class="IconaPanoramica" src="assets/calendar_clock_60dp_A764BD_FILL0_wght400_GRAD0_opsz48.png" alt="Data/Ora"/>
    <table id="customers">
      <tr>
        <td class="pre">${fattura.date ?? "Data non disponibile"}<br>${fattura.orario ?? "Orario non disponibile"}</td>
        <td class="iconaMoney">
          <img class="IconaPanoramica" src="assets/euro_symbol_60dp_A764BD_FILL0_wght400_GRAD0_opsz48.png" alt="Euro"/>
        </td>
        <td>
          <span class="Money">${fattura.importo ?? "Importo non disponibile"}</span>
        </td>
        <td>
          <button class="Delete" data-event-id="${fattura.id}">
            <img src="assets/delete.png" alt="Delete Icon" class="IconaPanoramica">
          </button>
        </td>
      </tr>
    </table>
  `;

  // Seleziona il dot e applica il colore dinamico
  const dotElement = specificaFattura.querySelector('.dot');
  if (dotElement && fattura.color) { // Assicurati che l'elemento e la proprietà colore esistano
    dotElement.style.backgroundColor = fattura.color;
    console.log(`🎨 Colore "${fattura.color}" applicato al dot per l'evento ID: ${fattura.id}`);
  } else {
    console.warn(`⚠️ Impossibile applicare colore al dot per evento ID: ${fattura.id}. Colore (${fattura.color}) o elemento dot mancante.`);
  }


  // Aggiungi l'event listener per il pulsante Delete
  const deleteButton = specificaFattura.querySelector('.Delete');
  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      const eventIdToDelete = deleteButton.dataset.eventId;
      if (confirm(`Sei sicuro di voler eliminare l'evento "${fattura.titolo}" (ID: ${eventIdToDelete})?`)) {
        try {
          // Esegui la chiamata DELETE direttamente (ora che è nello stesso file)
          const response = await fetch(`/db-events/${eventIdToDelete}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            throw new Error(`Errore durante l'eliminazione: ${response.status} - ${response.statusText}`);
          }
          console.log(`✅ Evento con ID ${eventIdToDelete} eliminato con successo dal backend.`);
          loadAndDisplayEvents(); // Ricarica gli eventi dopo l'eliminazione
          specificaFattura.innerHTML = ''; // Pulisci l'area dei dettagli
        } catch (error) {
          console.error("❌ Errore durante l'eliminazione dell'evento:", error);
          alert("Errore durante l'eliminazione dell'evento: " + error.message);
        }
      }
    });
  }
}

// Funzione per forzare un aggiornamento dei dati (es. tramite un bottone)
function refreshEvents() {
  console.log("🔄 Refresh manuale degli eventi...");
  loadAndDisplayEvents();
}

// --- AVVIO DELL'APPLICAZIONE ---

// 🚀 AVVIO AUTOMATICO: Carica gli eventi quando la pagina è completamente caricata
document.addEventListener('DOMContentLoaded', () => {
  console.log("📄 Pagina caricata, inizio caricamento eventi...");
  loadAndDisplayEvents();
});

// ⏰ AGGIORNAMENTO AUTOMATICO: Ricarica gli eventi ogni 2 minuti (opzionale, ma utile per dati dinamici)
setInterval(() => {
  console.log("⏰ Aggiornamento automatico eventi...");
  refreshEvents();
}, 120000); // 120000 millisecondi = 2 minuti