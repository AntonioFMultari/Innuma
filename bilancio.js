// Balance Page
function BalancePage() {
  // The wrapper for all balance page content
  const wrapperBilancio = document.createElement("div");
  wrapperBilancio.className = "contenitoreBilancio";

  // The main container for chart and transactions
  const cartellaBilancio = document.createElement("div");
  cartellaBilancio.className = "cartBil";
  wrapperBilancio.appendChild(cartellaBilancio);

  // Left part: Chart
  const cartBilSinistra = document.createElement("div");
  cartBilSinistra.className = "cartSinistra";
  cartellaBilancio.appendChild(cartBilSinistra);

  // Chart code (from Pietro Bosio)
  const grafaBilancio = document.createElement("div");
  grafaBilancio.className = "grafaBil";
  cartBilSinistra.appendChild(grafaBilancio);

  const graficoCanvas = document.createElement("canvas");
  graficoCanvas.id = "graficoCanvas";
  graficoCanvas.className = "graficoCanvas";
  // The chart canvas is now appended directly to grafaBilancio
  grafaBilancio.appendChild(graficoCanvas);

  const graficoTotale = document.createElement("div");
  graficoTotale.id = "grafico-total";
  graficoTotale.textContent = "€0.00";
  // The total amount display is now appended directly to grafaBilancio
  grafaBilancio.appendChild(graficoTotale);

  // Filters below the chart
  const contenutoFiltri = document.createElement("div");
  contenutoFiltri.className = "divBilancioFiltri";
  cartBilSinistra.appendChild(contenutoFiltri);
  

  
  const containerFiltriBilancio = document.createElement("div");
  containerFiltriBilancio.className = "containerFiltriBilancio";
  contenutoFiltri.appendChild(containerFiltriBilancio);
  

  
  const tendinaFiltriBilancio = document.createElement("div");
  tendinaFiltriBilancio.id = "tendinaFiltriBilancio";
  tendinaFiltriBilancio.className = "tendinaFiltriBilancio";
  containerFiltriBilancio.appendChild(tendinaFiltriBilancio);

  const filters = [
    { label: 'Tutti', colorClass: 'pallinoFiltro', type: 'all' },
    { label: 'Entrate', colorClass: 'pallinoEntrate', type: 'entrata' },
    { label: 'Uscite', colorClass: 'pallinoUscite', type: 'uscita' },
    { label: 'Da Cont.', colorClass: 'pallinoDaCont', type: 'pending' }
  ];

  filters.forEach((filter, index) => {
    const filtroEl = document.createElement('div');
    filtroEl.classList.add('elementoFiltro');
    filtroEl.dataset.filter = filter.type;
    if (index === 0) filtroEl.classList.add('attivo');

    const dot = document.createElement('span');
    dot.classList.add('pallino', filter.colorClass);

    const label = document.createElement('span');
    label.textContent = filter.label;

    filtroEl.appendChild(dot);
    filtroEl.appendChild(label);
    tendinaFiltriBilancio.appendChild(filtroEl); // Append directly to the created tendinaFiltriBilancio
  });
  
/*
  const filtroContainer = document.createElement('div');
  filtroContainer.classList.add('divBilancioFiltri');
  filtroContainer.id = 'filtroContainer';
  

   const cartSinistra = document.querySelector('.cartSinistra');
  if (cartSinistra) {
    cartSinistra.insertBefore(filtroContainer, cartSinistra.firstChild); // Add it at the top
  }*/

  const link = document.createElement("a");
  link.href = "bilancioEU.html";

  const bottoneTransazione = document.createElement("button");
  bottoneTransazione.className = "entrateUscita"
  bottoneTransazione.textContent = "Entrate/Uscite";
  link.appendChild(bottoneTransazione);
  cartBilSinistra.appendChild(link);

  const cartBilDestra = document.createElement("div");
  cartBilDestra.className = "cartDestra";
  cartellaBilancio.appendChild(cartBilDestra);

  const titoloBilancio = document.createElement("h2");
  titoloBilancio.className = "titoloBil";
  titoloBilancio.textContent = "Contabilità";
  cartBilDestra.appendChild(titoloBilancio);

  const listaBil = document.createElement("div");
  listaBil.className = "listaBil";
  cartBilDestra.appendChild(listaBil);

  return wrapperBilancio;
}

// Initialize the pie chart
let balanceChart = null; // Variable to hold the Chart.js instance

function renderBalanceChart(transactions) {
  const ctx = document.getElementById('graficoCanvas').getContext('2d');
  const graficoTotale = document.getElementById('grafico-total');

  const totalIn = transactions
    .filter(t => t.transazioneEntrata)
    .reduce((sum, t) => sum + parseFloat(t.transazioneEntrata), 0);

  const totalOut = transactions
    .filter(t => t.transazioneUscita)
    .reduce((sum, t) => sum + parseFloat(t.transazioneUscita), 0);

  const balance = totalIn - totalOut;

  graficoTotale.textContent = `€${balance.toFixed(2)}`;

  if (balanceChart) {
    balanceChart.destroy(); // Destroy existing chart instance
  }

  balanceChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Entrate', 'Uscite'],
      datasets: [{
        data: [totalIn, totalOut],
        backgroundColor: ['#ade27b', '#ff4645'], // Green for In, Red for Out
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%', // Makes it a ring chart
      plugins: {
        legend: {
          display: false // No legend as total is in the center
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed) {
                label += '€' + context.parsed.toFixed(2);
              }
              return label;
            }
          }
        }
      }
    }
  });
}


function updateGraphTotal(transactions) {
  const graficoTotale = document.getElementById("grafico-total");
  if (graficoTotale) {
    const totalIn = transactions
      .filter((t) => t.transazioneEntrata)
      .reduce((sum, t) => sum + parseFloat(t.transazioneEntrata), 0);
    const totalOut = transactions
      .filter((t) => t.transazioneUscita)
      .reduce((sum, t) => sum + parseFloat(t.transazioneUscita), 0);
    const total = totalIn - totalOut;
    graficoTotale.textContent = `€${total.toFixed(2)}`;
  }
}

function renderTransactions(transactions) {
  const listaBil = document.querySelector(".listaBil");
  listaBil.innerHTML = ""; // Clear existing list

  if (!transactions || transactions.length === 0) {
    listaBil.innerHTML = "<p>Nessuna transazione trovata.</p>";
    updateGraphTotal([]);
    renderBalanceChart([]);
    return;
  }

  transactions.forEach((t) => {
    const elementoTransazione = document.createElement("div");
    elementoTransazione.className = "elementoTransazione"; // This will be the "card"

    let pallinoClass = "";
    let amountText = "";
    let statusText = t.stato_transazione || 'N/A'; // Capture the status
    let transactionTypeClass = ''; // For specific styling based on type

    if (t.transazioneEntrata) {
      pallinoClass = "pallinoEntrate";
      amountText = `€${parseFloat(t.transazioneEntrata).toFixed(2)}`;
      elementoTransazione.classList.add("entrata");
      transactionTypeClass = 'transazioneEntrata'; // Class for the amount
    } else if (t.transazioneUscita) {
      pallinoClass = "pallinoUscite";
      amountText = `-€${parseFloat(t.transazioneUscita).toFixed(2)}`;
      elementoTransazione.classList.add("uscita");
      transactionTypeClass = 'transazioneUscita'; // Class for the amount
    } else {
      // Fallback for transactions that are neither 'entrata' nor 'uscita' but might have 'importo_transazione'
      pallinoClass = "pallinoDaCont";
      amountText = `€${parseFloat(t.importo_transazione || 0).toFixed(2)}`;
      elementoTransazione.classList.add("da-contabilizzare");
      transactionTypeClass = 'transazioneNeutro'; // Example: class for neutral amounts
    }

    // Using data_transazione as a simple description/subtitle for now
    const transactionDescription = `Data: ${new Date(t.data_transazione).toLocaleDateString('it-IT')}`;

    elementoTransazione.innerHTML = `
      <div class="transazioneIconaContenitore">
        <div class="pallino ${pallinoClass}"></div>
      </div>
      <div class="transazioneInfoPrincipale">
        <span class="transazioneTitolo">${t.transazioneNome || t.title || 'N/A'}</span>
        <span class="transazioneDescrizione">${transactionDescription}</span>
      </div>
      <div class="transazioneDettagliDestra">
        <span class="transazioneImporto ${transactionTypeClass}">${amountText}</span>
        <span class="transazioneTestoTotale">totale</span>
        <span class="transazioneStatoNuovo">${statusText}</span>
      </div>
    `;
    listaBil.appendChild(elementoTransazione);
  });
  updateGraphTotal(transactions);
  renderBalanceChart(transactions);
}


// Fetch transactions (using hardcoded data for testing)
function fetchAndRenderTransactions() {
  // Hardcoded test data for immediate display
  const testData = [
    {
      id: "1",
      transazioneNome: "Affitto",
      data_transazione: "2025-07-01T10:00:00",
      transazioneUscita: "750.00", // Expense
      stato_transazione: "Contab.",
      color: "#ff4645" // Example color for 'Uscita'
    },
    {
      id: "2",
      transazioneNome: "Stipendio",
      data_transazione: "2025-07-05T12:00:00",
      transazioneEntrata: "1500.00", // Income
      stato_transazione: "Contab.",
      color: "#ade27b" // Example color for 'Entrata'
    },
    {
      id: "3",
      transazioneNome: "Spesa Supermercato",
      data_transazione: "2025-07-07T08:30:00",
      transazioneUscita: "85.50", // Expense
      stato_transazione: "Contab.",
      color: "#ff4645"
    },
    {
      id: "4",
      transazioneNome: "Rimborso",
      data_transazione: "2025-07-10T15:00:00",
      transazioneEntrata: "50.00", // Income
      stato_transazione: "Contab.",
      color: "#ade27b"
    },
    {
      id: "5",
      transazioneNome: "Bolletta Luce",
      data_transazione: "2025-07-12T09:00:00",
      transazioneUscita: "120.00", // Expense
      stato_transazione: "In attesa",
      color: "#ff4645"
    },
    {
      id: "6",
      transazioneNome: "Vendita Online",
      data_transazione: "2025-07-11T14:00:00",
      transazioneEntrata: "200.00", // Income
      stato_transazione: "Contab.",
      color: "#ade27b"
    }
  ];
  renderTransactions(testData);
  // Uncomment the following lines when you have a backend to fetch real data
  /*
  inviaRichiesta("GET", "/db-events")
    .then((ris) => {
      const eventi = ris.data || ris;
      renderTransactions(eventi);
    })
    .catch((err) => {
      console.error(err);
      // Fallback to test data if fetching fails, or display an error message
      renderTransactions(testData);
    });
  */
}

// The event listener for the delete button is commented out as the button is removed.
// You can safely remove this block if you are sure you won't re-add the delete button.
/*
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
*/


// Listener for adding new events
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

  // Using test data logic for adding new event as well
  // In a real application, you would send this to your backend
  console.log("Adding new event (test mode):", nuovoEvento);
  // Add the new event to your testData array and re-render if you want to see it immediately
  // For now, it just logs, as we don't have a mutable global testData array.
  // When backend is integrated, uncomment the inviaRichiesta below
  /*
  inviaRichiesta("POST", "/db-events", nuovoEvento)
    .then(() => {
      fetchAndRenderTransactions(); // Re-fetch to include the new event
      document.getElementById("modal-evento").close();
    })
    .catch((err) => alert("Errore durante il salvataggio"));
  */
  fetchAndRenderTransactions(); // Re-render to simulate addition, will show hardcoded data
  document.getElementById("modal-evento").close();
};


document.addEventListener('DOMContentLoaded', function () {
  // Append the BalancePage content to the body
  document.body.appendChild(BalancePage());

  const filterBar = document.getElementById('tendinaFiltriBilancio');

  if (filterBar) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Mouse Wheel Scroll
    filterBar.addEventListener('wheel', (e) => {
      e.preventDefault();
      filterBar.scrollLeft += e.deltaY;
    });

    // Click and Drag
    filterBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      filterBar.classList.add('is-dragging');
      startX = e.pageX - filterBar.offsetLeft;
      scrollLeft = filterBar.scrollLeft;
    });

    filterBar.addEventListener('mouseleave', () => {
      isDragging = false;
      filterBar.classList.remove('is-dragging');
    });

    filterBar.addEventListener('mouseup', () => {
      isDragging = false;
      filterBar.classList.remove('is-dragging');
    });

    filterBar.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - filterBar.offsetLeft;
      const walk = (x - startX) * 1.5; // Multiplier for scroll speed
      filterBar.scrollLeft = scrollLeft - walk;
    });
  }

  // Initial fetch and render of transactions when the DOM is loaded
  fetchAndRenderTransactions();

  setupFiltroInterazione();
});

/*
document.addEventListener('DOMContentLoaded', () => {
  const filters = [
    { label: 'Entrate', colorClass: 'pallinoEntrate' },
    { label: 'Uscite', colorClass: 'pallinoUscite' },
    { label: 'Da Cont.', colorClass: 'pallinoDaCont' }
    // Add more filters here if needed
  ];

  const container = document.getElementById('filtroContainer');

  filters.forEach((filter, index) => {
    const filtroEl = document.createElement('div');
    filtroEl.classList.add('elementoFiltro');
    if (index === 0) filtroEl.classList.add('attivo'); // Make first one active by default

    // Create the dot
    const dot = document.createElement('span');
    dot.classList.add('pallino', filter.colorClass);

    // Create the label
    const label = document.createElement('span');
    label.textContent = filter.label;

    // Append dot and label to the filter element
    filtroEl.appendChild(dot);
    filtroEl.appendChild(label);

    // Optionally add click event to toggle "attivo" class
    filtroEl.addEventListener('click', () => {
      document.querySelectorAll('.elementoFiltro').forEach(el => el.classList.remove('attivo'));
      filtroEl.classList.add('attivo');
      // Add filter logic here if needed
    });

    // Add the filter to the container
    container.appendChild(filtroEl);
  });
});*/

//  const filters = [
//     { label: 'Tutti', colorClass: 'pallinoFiltro', type: 'all' },
//     { label: 'Entrate', colorClass: 'pallinoEntrate', type: 'entrata' },
//     { label: 'Uscite', colorClass: 'pallinoUscite', type: 'uscita' },
//     { label: 'Da Cont.', colorClass: 'pallinoDaCont', type: 'pending' }
//   ];

//   filters.forEach((filter, index) => {
//     const filtroEl = document.createElement('div');
//     filtroEl.classList.add('elementoFiltro');
//     filtroEl.dataset.filter = filter.type;
//     if (index === 0) filtroEl.classList.add('attivo');

//     const dot = document.createElement('span');
//     dot.classList.add('pallino', filter.colorClass);

//     const label = document.createElement('span');
//     label.textContent = filter.label;

//     label.classList.add('spanFiltriBil');

//     filtroEl.appendChild(dot);
//     filtroEl.appendChild(label);
//     document.getElementById('tendinaFiltriBilancio').appendChild(filtroEl);
//   });

  setupFiltroInterazione();

  function setupFiltroInterazione() {
  const filters = document.querySelectorAll('.elementoFiltro');
  const transazioni = document.querySelectorAll('.elementoTransazione');

  filters.forEach(filtro => {
    filtro.addEventListener('click', () => {
      // Update active state
      filters.forEach(el => el.classList.remove('attivo'));
      filtro.classList.add('attivo');

      const selectedFilter = filtro.dataset.filter;

      // Show/hide transactions
      transazioni.forEach(tx => {
        if (selectedFilter === 'all') {
          tx.style.display = '';
        } else {
          tx.style.display = tx.classList.contains(selectedFilter) ? '' : 'none';
        }
      });
    });
  });
}