const btnSpesa = [...document.querySelectorAll(".btnAggiungiSpese")];
const modal = document.getElementById("modal-spesa");
const chiudi = document.getElementById("chiudi-modal-spesa");
const salva = document.getElementById("salva-spesa");
const importInput = document.getElementById("importo-spesa");
const descrizioneInput = document.getElementById("descrizione-spesa");

btnSpesa.forEach((btn) => {
  btn.addEventListener("click", function () {
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
    _data = _data.toISOString().slice(0, 19).replace("T", " ");

    if (importo && descrizione) {
      inviaRichiesta("POST", "/db-spesa", {
        Descrizione: descrizione,
        Uscita: importo,
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
                            <span class="transazioneDescrizione">${
                              _data || "N/A"
                            }</span>
                        </div>
                        <div class="transazioneDettagliDestra">
                            <span class="transazioneImporto">${
                              importo || "N/A"
                            }</span>
                            <span class="transazioneTestoTotale">totale</span>
                        </div>
                    `;
        document.querySelector(".listaBil").appendChild(SpesaDiv);
        window.location.reload();
      });
    }
  };
}
