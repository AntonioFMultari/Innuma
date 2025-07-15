// Balance Page
function BalancePage() {
  const wrapperBilancio = document.createElement("div");
  wrapperBilancio.className = "contenitoreBilancio";

  const cartellaBilancio = document.createElement("div");
  cartellaBilancio.className = "cartBil";
  wrapperBilancio.appendChild(cartellaBilancio);

  const cartBilSinistra = document.createElement("div");
  cartBilSinistra.className = "cartSinistra";
  cartellaBilancio.appendChild(cartBilSinistra);

  const grafaBilancio = document.createElement("div");
  grafaBilancio.className = "grafaBil";
  cartBilSinistra.appendChild(grafaBilancio);

  const graficoCanvas = document.createElement("canvas");
  graficoCanvas.id = "graficoCanvas";
  graficoCanvas.className = "graficoCanvas";

  grafaBilancio.appendChild(graficoCanvas);

  const graficoTotale = document.createElement("div");
  graficoTotale.id = "grafico-total";
  graficoTotale.textContent = "€0.00";

  grafaBilancio.appendChild(graficoTotale);

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

  // placeholder filtri TONY
  const filters = [
    { label: "Tutti", colorClass: "pallinoFiltro", type: "all" },
    { label: "Entrate", colorClass: "pallinoEntrate", type: "entrata" },
    { label: "Uscite", colorClass: "pallinoUscite", type: "uscita" },
    { label: "Da Cont.", colorClass: "pallinoDaCont", type: "pending" },
  ];

  filters.forEach((filter, index) => {
    const filtroEl = document.createElement("div");
    filtroEl.classList.add("elementoFiltro");
    filtroEl.dataset.filter = filter.type;
    if (index === 0) filtroEl.classList.add("attivo");

    const dot = document.createElement("span");
    dot.classList.add("pallino", filter.colorClass);

    const label = document.createElement("span");
    label.textContent = filter.label;

    filtroEl.appendChild(dot);
    filtroEl.appendChild(label);
    tendinaFiltriBilancio.appendChild(filtroEl);
  });

  const link = document.createElement("a");
  link.href = "bilancioEU.html";

  const bottoneTransazione = document.createElement("button");
  bottoneTransazione.className = "entrateUscita";
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

// inizializza chart doughnut
let balanceChart = null;

function renderBalanceChart(transactions) {
  const ctx = document.getElementById("graficoCanvas").getContext("2d");
  const graficoTotale = document.getElementById("grafico-total");

  const totalIn = transactions
    .filter((t) => t.transazioneEntrata)
    .reduce((sum, t) => sum + parseFloat(t.transazioneEntrata), 0);

  const totalOut = transactions
    .filter((t) => t.transazioneUscita)
    .reduce((sum, t) => sum + parseFloat(t.transazioneUscita), 0);

  const balance = totalIn - totalOut;

  graficoTotale.textContent = `€${balance.toFixed(2)}`;

  if (balanceChart) {
    balanceChart.destroy();
  }

  balanceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Entrate", "Uscite"],
      datasets: [
        {
          data: [totalIn, totalOut],
          backgroundColor: ["#ade27b", "#ff4645"], // Green for In, Red for Out
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "80%", // crea doughnut
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed) {
                label += "€" + context.parsed.toFixed(2);
              }
              return label;
            },
          },
        },
      },
    },
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
  listaBil.innerHTML = "";

  if (!transactions || transactions.length === 0) {
    listaBil.innerHTML = "<p>Nessuna transazione trovata.</p>";
    updateGraphTotal([]);
    renderBalanceChart([]);
    return;
  }

  transactions.forEach((t) => {
    const elementoTransazione = document.createElement("div");
    elementoTransazione.className = "elementoTransazione";

    let pallinoClass = "";
    let amountText = "";
    let statusText = t.stato_transazione || "N/A";
    let transactionTypeClass = "";

    if (t.transazioneEntrata) {
      pallinoClass = "pallinoEntrate";
      amountText = `€${parseFloat(t.transazioneEntrata).toFixed(2)}`;
      elementoTransazione.classList.add("entrata");
      transactionTypeClass = "transazioneEntrata";
    } else if (t.transazioneUscita) {
      pallinoClass = "pallinoUscite";
      amountText = `-€${parseFloat(t.transazioneUscita).toFixed(2)}`;
      elementoTransazione.classList.add("uscita");
      transactionTypeClass = "transazioneUscita";
    } else {
      pallinoClass = "pallinoDaCont";
      amountText = `€${parseFloat(t.importo_transazione || 0).toFixed(2)}`;
      elementoTransazione.classList.add("da-contabilizzare");
      transactionTypeClass = "transazioneNeutro"; // Example: class for neutral amounts
    }

    // Using data_transazione as a simple description/subtitle for now
    const transactionDescription = `Data: ${new Date(
      t.data_transazione
    ).toLocaleDateString("it-IT")}`;

    elementoTransazione.innerHTML = `
      <div class="transazioneIconaContenitore">
        <div class="pallino ${pallinoClass}"></div>
      </div>
      <div class="transazioneInfoPrincipale">
        <span class="transazioneTitolo">${
          t.transazioneNome || t.title || "N/A"
        }</span>
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

// placeholder lista TONY
function fetchAndRenderTransactions() {
  const testData = [
    {
      id: "1",
      transazioneNome: "Affitto",
      data_transazione: "2025-07-01T10:00:00",
      transazioneUscita: "750.00",
      stato_transazione: "Contab.",
      color: "#ff4645",
    },
    {
      id: "2",
      transazioneNome: "Stipendio",
      data_transazione: "2025-07-05T12:00:00",
      transazioneEntrata: "1500.00",
      stato_transazione: "Contab.",
      color: "#ade27b",
    },
    {
      id: "3",
      transazioneNome: "Spesa Supermercato",
      data_transazione: "2025-07-07T08:30:00",
      transazioneUscita: "85.50",
      stato_transazione: "Contab.",
      color: "#ff4645",
    },
    {
      id: "4",
      transazioneNome: "Rimborso",
      data_transazione: "2025-07-10T15:00:00",
      transazioneEntrata: "50.00",
      stato_transazione: "Contab.",
      color: "#ade27b",
    },
    {
      id: "5",
      transazioneNome: "Bolletta Luce",
      data_transazione: "2025-07-12T09:00:00",
      transazioneUscita: "120.00", // Expense
      stato_transazione: "In attesa",
      color: "#ff4645",
    },
    {
      id: "6",
      transazioneNome: "Vendita Online",
      data_transazione: "2025-07-11T14:00:00",
      transazioneEntrata: "200.00",
      stato_transazione: "Contab.",
      color: "#ade27b",
    },
  ];
  renderTransactions(testData);
}

// evento scroll non ancora funzionante (in piu se abbiamo tempo)
document.addEventListener("DOMContentLoaded", function () {
  document.body.appendChild(BalancePage());

  const filterBar = document.getElementById("tendinaFiltriBilancio");

  if (filterBar) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    // evento scroll mousewheel
    filterBar.addEventListener("wheel", (e) => {
      e.preventDefault();
      filterBar.scrollLeft += e.deltaY;
    });

    // evento inizio del trascinamento (quando si clicca il mouse)
    filterBar.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        isDragging = true;
        filterBar.classList.add("is-dragging");
        startX = e.pageX - filterBar.offsetLeft;
        scrollLeft = filterBar.scrollLeft;
      }
    });

    // evento fine del trascinamento (quando il mouse esce o viene rilasciato)
    filterBar.addEventListener("mouseleave", () => {
      isDragging = false;
      filterBar.classList.remove("is-dragging");
    });

    filterBar.addEventListener("mouseup", () => {
      isDragging = false;
      filterBar.classList.remove("is-dragging");
    });

    // evento durante il trascinamento (quando il mouse si muove con il tasto premuto)
    filterBar.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - filterBar.offsetLeft;
      const walk = (x - startX) * 1.5;
      filterBar.scrollLeft = scrollLeft - walk;
    });
  } else {
    console.warn(
      "Elemento #tendinaFiltriBilancio non trovato. Lo scorrimento non sarà abilitato."
    );
  }

  // chiamata iniziale per recuperare e renderizzare le transazioni quando il DOM è caricato
  fetchAndRenderTransactions();

  setupFiltroInterazione();
});

setupFiltroInterazione();

function setupFiltroInterazione() {
  const filters = document.querySelectorAll(".elementoFiltro");
  const transazioni = document.querySelectorAll(".elementoTransazione");

  filters.forEach((filtro) => {
    filtro.addEventListener("click", () => {
      // Update active state
      filters.forEach((el) => el.classList.remove("attivo"));
      filtro.classList.add("attivo");

      const selectedFilter = filtro.dataset.filter;

      // mostra/nasconde transactions
      transazioni.forEach((tx) => {
        if (selectedFilter === "all") {
          tx.style.display = "";
        } else {
          tx.style.display = tx.classList.contains(selectedFilter)
            ? ""
            : "none";
        }
      });
    });
  });
}
