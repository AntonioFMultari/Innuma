const btnSpesa = [...document.querySelectorAll(".btnAggiungiSpese")];
console.log(btnSpesa);
const modal = document.getElementById("modal-spesa");
const chiudi = document.getElementById("chiudi-modal-spesa");
const salva = document.getElementById("salva-spesa");
const importInput = document.getElementById("importo-spesa");
const descrizioneInput = document.getElementById("descrizione-spesa");

btnSpesa.forEach((btn) => {
  btn.addEventListener("click", function () {
    console.log(importInput, descrizioneInput)
    if (importInput && descrizioneInput) {
      modal.showModal();
      importInput.value = "";
      descrizioneInput.value = "";
    }
  });
});
if (chiudi && modal) {
  chiudi.onclick = () => {
    modal.close();
  };
}
if (salva && modal) {
  salva.onclick = (e) => {
    e.preventDefault();
    const importo = importInput.value.trim();
    const descrizione = descrizioneInput.value.trim();

    if (!importo) return alert("Inserisci un importo per la spesa!");
    if (!descrizione) return alert("Inserisci una descrizione per la spesa!");

    _data = new Date();
    const anni = String(_data.getFullYear()).padStart(2, "0");
    const mesi = String(_data.getMonth() + 1).padStart(2, "0");
    const giorni = String(_data.getDate()).padStart(2, "0");
    const ore = String(_data.getHours()).padStart(2, "0");
    const minuti = String(_data.getMinutes()).padStart(2, "0");
    _data = `${anni}-${mesi}-${giorni} ${ore}:${minuti}:00`;

    if (importo && descrizione) {
      inviaRichiesta("POST", "/db-spesa", {
        Descrizione: descrizione,
        Uscita: importo + ".00",
        _data: _data,
      }).then((response) => {
        const newSpesa = response.data;
        const SpesaDiv = document.createElement("div");
        SpesaDiv.classList.add("elementoTransazione", "uscita");
        SpesaDiv.innerHTML = `
                        <div class="transazioneIconaContenitore">
                            <div class="pallino" style="background-color: #ff4645;"></div>
                        </div>
                        <div class="transazioneInfoPrincipale">
                            <span class="transazioneTitolo">${
                              descrizione || "N/A"
                            }</span>
                            <span class="transazioneDescrizione">Data: ${giorni}/${mesi}/${anni}</span>
                        </div>
                        <div class="transazioneDettagliDestra">
                            <span class="transazioneImporto transazioneUscita">-€${
                              importo || "N/A"
                            }.00</span>
                            <span class="transazioneTestoTotale">totale</span>
                        </div>
                    `;
        document.querySelector(".listaBil").appendChild(SpesaDiv);
        //window.location.reload();
      });
    }
  };
}
