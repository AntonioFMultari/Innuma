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

// Funzione per creare un grafico a torta con gradienti
let vettoreDati = [20, 30, 50];
let vettoreColori = ["#ff4645", "#ade27b", "#49b4ff"];
const grafico = document.getElementById("grafico");
const CreaGrafico = (grafico, vettoreDati, vettoreColori) => {
  const somma = vettoreDati.reduce((acc, val) => acc + val, 0);

  if (somma < 99 || somma > 101) {
    console.error("La somma dei dati deve essere 100");
    return;
  }

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

    return `${
      vettoreColori[i % vettoreColori.length]
    } ${inizioPercent}% ${finePercent}%`;
  });

  const gradient = `conic-gradient(${fasiGradient.join(", ")})`;

  if (!grafico) return;

  grafico.style.background = gradient;
  grafico.style.borderRadius = "50%";
};
CreaGrafico(grafico, vettoreDati, vettoreColori);