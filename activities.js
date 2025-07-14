document.addEventListener("DOMContentLoaded", function () {
  inviaRichiesta("GET", "/db-attivita").then((response) => {
    const activities = response.data;
    activities.forEach((activity) => {
      const attivitaDiv = document.createElement("div");
      attivitaDiv.classList.add("AttOggetto");
      attivitaDiv.setAttribute("data-id", activity.ID); // <-- aggiungi questa riga
      console.log("Attività:", activity.Colore);
      attivitaDiv.innerHTML = `
                <div class="AttPallino" style="background: ${
                  activity.Colore
                };"></div>
                <span class="AttNome">${activity.Descrizione}</span>
                <span class="AttInps">${activity.INPS ? "Si" : "No"}</span>
                <span class="AttTar">${activity.Tariffa} EUR/h</span>
                <button class="DeleteBtn"><img src="assets/delete.png" alt="Delete Icon" class="Deleteimg"></button>
            `;
      document.querySelector(".listaAtt").appendChild(attivitaDiv);
    });
    const AggActButton = document.getElementById("AggAct");
    const modal = document.getElementById("modal-attivita");
    const chiudi = document.getElementById("chiudi-modal-attivita");
    const salva = document.getElementById("salva-attivita");
    const nomeInput = document.getElementById("nome-attivita");
    const tariffaInput = document.getElementById("tariffa-attivita");
    const coloreInput = document.getElementById("colore-attivita");
    const rivalsaInput = document.getElementById("rivalsa-inps");

    AggActButton.addEventListener("click", function () {
      if (nomeInput && tariffaInput && coloreInput && rivalsaInput) {
        modal.showModal();
        nomeInput.value = "";
        tariffaInput.value = "";
        coloreInput.value = "#d484e8"; // Imposta un colore predefinito
        rivalsaInput.checked = false; // Imposta la casella di controllo su non selezionata
      }
    });
    if (chiudi && modal) {
      chiudi.onclick = () => {
        modal.close();
      };
    }
    if (salva && modal) {
      salva.onclick = (e) => {
        e.preventDefault();
        const nome = nomeInput.value.trim();
        const tariffa = tariffaInput.value.trim();
        const colore = coloreInput.value.trim();
        const rivalsa = rivalsaInput.checked ? 1 : 0; // Converti in 1 o 0 per il database

        if (!nome) return alert("Inserisci un nome all'evento!");
        if (!tariffa) return alert("Inserisci una tariffa per l'attività!");
        if (!colore) return alert("Inserisci un colore per l'attività!");

        if (nome && tariffa && colore) {
          inviaRichiesta("POST", "/db-attivita", {
            Descrizione: nome,
            Tariffa: tariffa,
            Colore: colore,
            INPS: rivalsa,
          }).then((response) => {
            const newActivity = response.data;
            const attivitaDiv = document.createElement("div");
            attivitaDiv.classList.add("AttOggetto");
            attivitaDiv.innerHTML = `
                        <div class="AttPallino" style="background: ${
                          newActivity.Colore
                        };"></div>
                        <span class="AttNome">${newActivity.Descrizione}</span>
                        <span class="AttInps">${
                          newActivity.INPS ? "Si" : "No"
                        }</span>
                        <span class="AttTar">${newActivity.Tariffa} EUR/h</span>
                        <button class="DeleteBtn"><img src="assets/delete.png" alt="Delete Icon" class="Deleteimg"></button>
                    `;
            document.querySelector(".listaAtt").appendChild(attivitaDiv);
            //window.location.reload();
          });
        }
      };

      document.querySelectorAll(".DeleteBtn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const attivitaDiv = this.closest(".AttOggetto");
          const idAttivita = attivitaDiv.getAttribute("data-id");
          const nomeAttivita =
            attivitaDiv.querySelector(".AttNome").textContent;
          if (
            confirm(
              `Sei sicuro di voler eliminare l'attività "${nomeAttivita}"? Perderai tutti gli eventi connessi a questa attività`
            )
          ) {
            inviaRichiesta("DELETE", `/db-attivita/${idAttivita}`).then(() => {
              attivitaDiv.remove();
            });
          }
        });
      });
    }
  });
});
