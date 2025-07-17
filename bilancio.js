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

  // crea i filtri (Populate filters dynamically)
  tendinaFiltriBilancio.innerHTML = ""; // Clear existing filters
  inviaRichiesta("GET", "/db-attivita")
    .then((ris) => {
      const attivita = ris.data;

      // Add an "All" filter option
      const allFilterEl = document.createElement("div");
      allFilterEl.classList.add("elementoFiltro");
      allFilterEl.dataset.filter = "all";
      allFilterEl.classList.add("attivo"); // 'All' is active by default
      const allLabel = document.createElement("span");
      allLabel.textContent = "Tutto";
      allFilterEl.appendChild(allLabel);
      tendinaFiltriBilancio.appendChild(allFilterEl);

      // Create filters from activities
      attivita.forEach((filter) => {
        const filtroEl = document.createElement("div");
        filtroEl.classList.add("elementoFiltro");
        filtroEl.dataset.filter = filter.Descrizione; // Use description for filtering
        filtroEl.dataset.type = filter.type; // Add type for filtering if needed

        const dot = document.createElement("span");
        dot.classList.add("pallino");
        dot.style.backgroundColor = filter.Colore;

        const label = document.createElement("span");
        label.textContent = filter.Descrizione || "Attività Sconosciuta";

        filtroEl.appendChild(dot);
        filtroEl.appendChild(label);
        tendinaFiltriBilancio.appendChild(filtroEl);
      });
    })
    .catch((error) => {
      console.error("Error fetching activities:", error);
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

// Initialize chart doughnut
let balanceChart = null;

async function renderBalanceChart(transactions) {
  const ctx = document.getElementById("graficoCanvas").getContext("2d");
  const graficoTotale = document.getElementById("grafico-total");

  let totalIn = 0;
  let totalOut = 0;

  // Fetch activities to get colors and descriptions for the chart
  const attivitaResponse = await inviaRichiesta("GET", "/db-attivita");
  const attivitaMap = new Map(
    attivitaResponse.data.map((a) => [
      a.Descrizione,
      { color: a.Colore, type: a.type },
    ])
  );

  const chartLabels = [];
  const chartData = [];
  const chartColors = [];
  const chartDataMap = new Map(); // To aggregate data by activity description

  transactions.forEach((t) => {
    const amount = parseFloat(t.tariffa_oraria) || 0;
    const isExpense = t.Uscita && parseFloat(t.Uscita) > 0;

    if (isExpense) {
      totalOut += parseFloat(t.Uscita);
    } else {
      totalIn += amount;
    }

    // Aggregate data for the doughnut chart by activity description
    const activityDesc = t.descrizione_attivita || "Sconosciuto";
    const currentAmount = chartDataMap.get(activityDesc) || 0;
    chartDataMap.set(
      activityDesc,
      currentAmount + (isExpense ? parseFloat(t.Uscita) : amount)
    );
  });

  // Populate chart data based on aggregated map
  chartDataMap.forEach((value, key) => {
    chartLabels.push(key);
    chartData.push(value);
    const activityInfo = attivitaMap.get(key);
    chartColors.push(activityInfo ? activityInfo.color : "#CCCCCC"); // Default color if not found
  });

  const balance = totalIn - totalOut;
  graficoTotale.textContent = `€${balance.toFixed(2)}`;

  if (balanceChart) {
    balanceChart.destroy();
  }

  balanceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: chartColors,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
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
  setTimeout(() => {
    const graficoTotale = document.getElementById("grafico-total");
    if (graficoTotale) {
      let totalIn = 0;
      let totalOut = 0;
      for (const t of transactions) {
        totalIn += parseFloat(t.tariffa_oraria) || 0;
        totalOut += parseFloat(t.Uscita) || 0; // Assuming Uscita is a positive value representing an expense
      }
      let total = totalIn - totalOut;
      graficoTotale.innerText = `€${total.toFixed(2)}`;
    }
  }, 1);
}

// Render transactions
async function renderTransactions(transactions, attivita) {
  const listaBil = document.querySelector(".listaBil");
  listaBil.innerHTML = ""; // Clear existing transactions

  const attivitaMap = new Map(
    attivita.map((a) => [a.Descrizione, { color: a.Colore, type: a.type }])
  );

  transactions.forEach((item) => {
    const isExpense = item.Uscita && parseFloat(item.Uscita) > 0;
    const amount = isExpense
      ? parseFloat(item.Uscita)
      : parseFloat(item.tariffa_oraria);
    const amountPrefix = isExpense ? "-" : "+";
    const amountClass = isExpense ? "transazioneUscita" : "transazioneEntrata";
    const transactionTypeClass = isExpense ? "uscita" : "entrata";

    const activityInfo = attivitaMap.get(item.descrizione_attivita);
    const dotColor = activityInfo ? activityInfo.color : "#CCCCCC"; // Default grey if activity not found

    const date = new Date(item.end); // Assuming 'end' contains the full date string
    const giorno = String(date.getDate()).padStart(2, "0");
    const mese = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const anno = String(date.getFullYear());

    const elementoTransazione = document.createElement("div");
    elementoTransazione.classList.add(
      "elementoTransazione",
      transactionTypeClass
    );
    elementoTransazione.setAttribute("data-id", item.id);
    elementoTransazione.setAttribute(
      "data-filter-category",
      item.descrizione_attivita
    ); // Add category for filtering

    elementoTransazione.innerHTML = `
            <div class="transazioneIconaContenitore">
                <div class="pallino" style="background-color: ${dotColor};"></div>
            </div>
            <div class="transazioneInfoPrincipale">
                <span class="transazioneTitolo">${item.title || "N/A"}</span>
                <span class="transazioneDescrizione">Data: ${giorno}/${mese}/${anno}</span>
            </div>
            <div class="transazioneDettagliDestra">
                <span class="transazioneImporto ${amountClass}">${amountPrefix}€${amount.toFixed(
      2
    )}</span>
                <span class="transazioneTestoTotale">totale</span>
            </div>
        `;
    listaBil.appendChild(elementoTransazione);
  });
}

// Main function to load and display data
document.addEventListener("DOMContentLoaded", async function () {
  document.body.appendChild(BalancePage());

  try {
    // Fetch both activities and events concurrently
    const [eventsResponse, attivitaResponse] = await Promise.all([
      inviaRichiesta("GET", "/db-events"),
      inviaRichiesta("GET", "/db-attivita"),
    ]);

    const eventi = eventsResponse.data;
    const attivita = attivitaResponse.data;

    // Render transactions with activity data for colors
    await renderTransactions(eventi, attivita);
    // Render the chart with transaction data
    renderBalanceChart(eventi);
    // Update total displayed below the chart (redundant if renderBalanceChart already does it, but good for clarity)
    updateGraphTotal(eventi);

    setupFiltroInterazione();
  } catch (error) {
    console.error("Error loading balance data:", error);
  }

  // Handle filter bar dragging
  const filterBar = document.getElementById("tendinaFiltriBilancio");

  if (filterBar) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    filterBar.addEventListener("wheel", (e) => {
      e.preventDefault();
      filterBar.scrollLeft += e.deltaY;
    });

    filterBar.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        isDragging = true;
        filterBar.classList.add("is-dragging");
        startX = e.pageX - filterBar.offsetLeft;
        scrollLeft = filterBar.scrollLeft;
      }
    });

    filterBar.addEventListener("mouseleave", () => {
      isDragging = false;
      filterBar.classList.remove("is-dragging");
    });

    filterBar.addEventListener("mouseup", () => {
      isDragging = false;
      filterBar.classList.remove("is-dragging");
    });

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
});

// Function to set up filter interaction
function setupFiltroInterazione() {
  const filters = document.querySelectorAll(".elementoFiltro");
  const listaBil = document.querySelector(".listaBil"); // Get the parent container
  const transazioni = listaBil.querySelectorAll(".elementoTransazione"); // Get all transaction elements

  filters.forEach((filtro) => {
    filtro.addEventListener("click", () => {
      // Update active state
      filters.forEach((el) => el.classList.remove("attivo"));
      filtro.classList.add("attivo");

      const selectedFilterCategory = filtro.dataset.filter;

      // Show/hide transactions based on the selected filter
      let counterNascosti = 0;
      transazioni.forEach((tx) => {
        const txCategory = tx.dataset.filterCategory;
        //let counter = 0;
        if (
          selectedFilterCategory === "all" ||
          txCategory === selectedFilterCategory
        ) {
          tx.style.display = ""; // Show
          counterNascosti++;
        } else {
          tx.style.display = "none"; // Hide
        }
      });
      if (counterNascosti == 0) {
        // Show a message or handle the case where no transactions are visible
        const noTransactionsMessage = document.createElement("div");
        noTransactionsMessage.className = "no-transactions-message";
        noTransactionsMessage.textContent =
          "Nessuna transazione trovata per questo filtro.";
        listaBil.appendChild(noTransactionsMessage);
      }
    });
  });
}
