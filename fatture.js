/*// Seleziona il div padre
const anteprimaFatture = document.querySelector('.anteprimaFatture');

// Crea un nuovo div figlio
const anteprimaSpec = document.createElement('div');

// (Opzionale) Aggiungi una classe o un id al nuovo div
anteprimaSpec.classList.add('figlioAnteprima');
anteprimaSpec.textContent = 'Questo è un div figlio';

// Aggiungi il nuovo div come figlio di anteprimaFatture
anteprimaFatture.appendChild(anteprimaSpec);*/


let anteprimaFatture = document.getElementsByClassName("anteprimaFatture")[0];

let anteprime = [
  {
    titolo: "Lezione Privata - Matematica - Esponenziali",
    date: "15/06/2025",
    nome: "Mario Rossi",
    panoramica: [
      "Ripasso equazioni esponenziali",
      "Ripasso disequazioni esponenziali",
      "Ripasso proprietà delle esponenziali",
      "Applicazione dell'equazione in grafico"
    ],
    orario: "15:30/17:00",
    importo: "25.00"
  },
  {
    titolo: "Lezione Privata - Scienze - Duplicazione DNA",
    date: "14/06/2025",
    nome: "Mario Rossi",
  },
  {
    titolo: "Elaborazione piano nutrizionale",
    date: "14/06/2025",
    nome: "Marcello Rossi"
  },
   {
    titolo: "Lezione pubblica - Scienze - 3^ B Scientifico",
    date: "13/06/2025",
    nome: "Liceo Vallauri"

  },
  {
    titolo: "Lezione pubblica - Scienze - 3^ B Scientifico",
    date: "13/06/2025",
    nome: "Liceo Vallauri"
    
  }
];

anteprime = anteprime.map(anteprima => {
  let anteprimaSpec = document.createElement("div");
  anteprimaSpec.stocazzo = anteprima;
  anteprimaSpec.classList.add("anteprimaSpec");
  // Imposta display grid e proprietà richieste
  anteprimaSpec.style.display = "grid";
  anteprimaSpec.style.gridTemplateColumns = "repeat(5, 1fr)";
  anteprimaSpec.style.gridTemplateRows = "repeat(5, 1fr)";
  anteprimaSpec.style.gridColumnGap = "0rem";
  anteprimaSpec.style.gridRowGap = "0rem";

  // div1
  let div1 = document.createElement("div");
  div1.classList.add("div1");
  div1.style.gridArea = "1 / 1 / 6 / 2";
  let img = document.createElement("img");
  img.src = "assets/arrow_right_60dp_000000_FILL0_wght400_GRAD0_opsz48.png";
  img.alt = "Icona arrow_right_60dp_000000_FILL0_wght400_GRAD0_opsz48";
  img.classList.add("arrowIcon");
  div1.appendChild(img);

  // div2
  let div2 = document.createElement("div");
  div2.classList.add("div2");
  div2.style.gridArea = "1 / 2 / 4 / 6";
  let titolo = document.createElement("h3");
  titolo.textContent = anteprima.titolo;
  div2.appendChild(titolo);

  // div3
  let div3 = document.createElement("div");
  div3.classList.add("div3");
  div3.style.gridArea = "4 / 2 / 6 / 4";
  let date = document.createElement("p");
  date.textContent = anteprima.date;
  div3.appendChild(date);

  // div4
  let div4 = document.createElement("div");
  div4.classList.add("div4");
  div4.style.gridArea = "4 / 4 / 6 / 6";
  let nome = document.createElement("p");
  nome.textContent = anteprima.nome;
  div4.appendChild(nome);

  // Aggiungi i div grid all'elemento principale
  anteprimaSpec.appendChild(div1);
  anteprimaSpec.appendChild(div2);
  anteprimaSpec.appendChild(div3);
  anteprimaSpec.appendChild(div4);

  // let amount = document.createElement("p");
  // amount.textContent = anteprima.amount;
  // anteprimaSpec.appendChild(amount);

  anteprimaFatture.appendChild(anteprimaSpec);
  return anteprimaSpec;
});

function mostraSpecificaFattura(fattura) {
  const specificaFattura = document.querySelector('.specificaFattura');
  console.log(fattura)
  specificaFattura.innerHTML = `
    <span class="dot"></span>
    <div class="DivTitolo">
      <span class="TitoloFattura">${fattura.titolo}</span>
      <span class="SottoTitolo">${fattura.nome}</span>
    </div>
    <img class="IconaPanoramica" src="assets/overview_60dp_A764BD_FILL0_wght400_GRAD0_opsz48.png"/>
    <div class="Panoramica">
      <ul>
        ${fattura.panoramica?.map(punto => `<li>${punto}</li>`)?.join('') ?? "Dettagli non disponibili"}
      </ul>
    </div>
    <img class="IconaPanoramica" src="assets/calendar_clock_60dp_A764BD_FILL0_wght400_GRAD0_opsz48.png">
    <table id="customers">
      <tr>
        <td class="pre">${fattura.date ?? "Data non disponibile"}<br>${fattura.orario  ?? "Orario non disponibile"}</td>
        <td class="iconaMoney">
          <img class="IconaPanoramica" src="assets/euro_symbol_60dp_A764BD_FILL0_wght400_GRAD0_opsz48.png"/>
        </td>
        <td>
          <span class="Money">${fattura.importo ?? "Importo non disponibile"}</span>
        </td>
        <td>
          <button class="Delete">
            <img src="assets/delete.png" alt="Delete Icon" class="IconaPanoramica">
          </button>
        </td>
      </tr>
    </table>
  `;
}

anteprime.forEach((anteprima, index) => {
  anteprima.addEventListener("click", () => {
  anteprime.forEach((a) => {
    a.classList.toggle("active", a === anteprima);
  });
   mostraSpecificaFattura(anteprima.stocazzo);
  });
});

