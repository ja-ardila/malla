fetch("malla_interactiva_corregida.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("malla-container");
    data.forEach(materia => {
      const card = document.createElement("div");
      card.className = "materia";
      card.innerHTML = `
        <h3>${materia.nombre}</h3>
        <div class="codigo">Código: ${materia.codigo}</div>
        <div class="semestre">Semestre: ${materia.semestre}</div>
        <div class="prerrequisitos">
          <strong>Prerrequisitos:</strong> ${
            materia.prerrequisitos.length > 0 ? materia.prerrequisitos.join(", ") : "Ninguno"
          }
        </div>
      `;
      container.appendChild(card);
    });
  });
