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

let anteprimaSpec = document.createElement("div");
anteprimaSpec.classList.add("anteprimaSpec");

anteprimaFatture.appendChild(anteprimaSpec);