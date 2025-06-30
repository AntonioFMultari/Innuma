//Inizializzazione del codice JavaScript
// Questo codice viene eseguito quando la pagina è completamente caricata.
window.addEventListener("load", init);

const c = console.log;

function init() {
  const tendinaHamburger =
    document.getElementsByClassName("tendinaHamburger")[0];
  if (tendinaHamburger) {
    tendinaHamburger.style.display = "none"; // Nascondi la tendina all'inizio
  }

  const containerFiltri = document.getElementsByClassName("containerFiltri")[0];
  if (containerFiltri) {
    containerFiltri.style.display = "none"; // Nascondi i filtri all'inizio
  }
}

//FUNZIONE SALUTO
// Questa funzione mostra un saluto in base all'ora corrente.
window.addEventListener("load", saluto);

function saluto() {
  const ora = new Date().getHours();
  let saluto = document.getElementsByClassName("spanSaluto")[0];

  if (ora <= 5 && ora >= 12) {
    saluto.innerText = "Buongiorno ☀️";
  } else if (ora <= 19) {
    saluto.innerText = "Buon pomeriggio ☀️";
  } else {
    saluto.innerText = "Buona sera 🌙";
  }
}

//FUNZIONE MENU HAMBURGERß

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
  const premuto = e.currentTarget;

  const ElementoHamburger = document.getElementsByClassName(
    "divElementoHamburger"
  );

  Array.from(ElementoHamburger).forEach((elemento) => {
    elemento.classList.toggle("elementoSelezionato", elemento === premuto);
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
