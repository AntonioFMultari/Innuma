// Funzione per creare un grafico a torta con gradienti
let vettoreDati = [20, 30, 50];
let vettoreColori = ["red", "green", "blue"];
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
