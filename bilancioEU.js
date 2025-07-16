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

  const graficoTotale = document.createElement("span");
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
  link.href = "bilancio.html";

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
  titoloBilancio.textContent = "Transazioni";
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

  let totalIn = 0;
  for (const t of transactions) {
    totalIn += parseFloat(t.tariffa_oraria) || 0;
  }

  let totalOut = 0;
  console.log(transactions);
  for (const t of transactions) {
    totalOut += parseFloat("-" + t.Uscita) || 0;
  }

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
          backgroundColor: ["#ade27b", "#ff4645"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%", // crea doughnut
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
        totalOut += parseFloat(t.Uscita) || 0;
      }
      let total = totalIn - totalOut;
      graficoTotale.innerText = `€${total.toFixed(2)}`;
    }
  }, 1);
}

//TONY: display transactions
document.addEventListener("DOMContentLoaded", async function () {
  BalancePage();

  const arr = [
    inviaRichiesta("GET", "/db-spesa"),
    inviaRichiesta("GET", "/db-events"),
  ];

  let res = await Promise.all(arr).catch(() =>
    alert("Errore nella richiesta dei dati")
  );

  if (!res) return;

  res = res
    .map((r) => r.data)
    .flatMap((r) => r)
    .sort((a, b) => {
      const dataA = new Date(a._data || a.end);
      const dataB = new Date(b._data || b.end);
      return dataB - dataA;
    });

  console.log(res);

  for (const r of res) {
    if ("tariffa_oraria" in r) {
      const entrataItem = r;

      const elementoTransazione = document.createElement("div");
      elementoTransazione.classList.add("elementoTransazione", "entrata");
      elementoTransazione.setAttribute("data-id", entrataItem.id); // <-- aggiungi questa riga

      const anno = String(entrataItem.end.split(" ")[0].split("-")[0]).padStart(
        2,
        "0"
      );
      const mese = String(entrataItem.end.split(" ")[0].split("-")[1]).padStart(
        2,
        "0"
      );
      const giorno = String(entrataItem.end.split(" ")[0].split("-")[2])
        .padStart(2, "0")
        .split("T")[0];

      elementoTransazione.innerHTML = `
                <div class="transazioneIconaContenitore">
                            <div class="pallino pallinoEntrate"></div>
                        </div>
                        <div class="transazioneInfoPrincipale">
                            <span class="transazioneTitolo">${
                              entrataItem.title || "N/A"
                            }</span>
                            <span class="transazioneDescrizione">Data: ${giorno}/${mese}/${anno}</span>
                        </div>
                        <div class="transazioneDettagliDestra">
                            <span class="transazioneImporto transazioneEntrata">+€${
                              entrataItem.tariffa_oraria || "N/A"
                            }</span>
                            <span class="transazioneTestoTotale">totale</span>
                        </div>
            `;
      elementoTransazione.classList.add("entrata");

      // Aggiungi l'element
      document
        .getElementsByClassName("listaBil")[0]
        .appendChild(elementoTransazione);
      continue;
    }
    const spesaItem = r;

    const elementoTransazione = document.createElement("div");
    elementoTransazione.classList.add("elementoTransazione", "uscita");
    elementoTransazione.setAttribute("data-id", spesaItem.ID); // <-- aggiungi questa riga

    const anno = String(spesaItem._data.split(" ")[0].split("-")[0]).padStart(
      2,
      "0"
    );
    const mese = String(spesaItem._data.split(" ")[0].split("-")[1]).padStart(
      2,
      "0"
    );
    const giorno = String(spesaItem._data.split(" ")[0].split("-")[2])
      .padStart(2, "0")
      .split("T")[0];

    elementoTransazione.innerHTML = `
                <div class="transazioneIconaContenitore">
                            <div class="pallino pallinoUscite"></div>
                        </div>
                        <div class="transazioneInfoPrincipale">
                            <span class="transazioneTitolo">${
                              spesaItem.Descrizione || "N/A"
                            }</span>
                            <span class="transazioneDescrizione">Data: ${giorno}/${mese}/${anno}</span>
                        </div>
                        <div class="transazioneDettagliDestra">
                            <span class="transazioneImporto transazioneUscita">-€${
                              spesaItem.Uscita || "N/A"
                            }</span>
                            <span class="transazioneTestoTotale">totale</span>
                        </div>
            `;
    elementoTransazione.classList.add("uscita");
    console.log(spesaItem);
    // Aggiungi l'element
    document
      .getElementsByClassName("listaBil")[0]
      .appendChild(elementoTransazione);
  }

  updateGraphTotal(res);
  renderBalanceChart(res);
});

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
  //fetchAndRenderTransactions();

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
