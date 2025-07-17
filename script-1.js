
let materiasCompletadas = new Set(JSON.parse(localStorage.getItem("materiasCompletadas") || "[]"));

function guardarEstado() {
  localStorage.setItem("materiasCompletadas", JSON.stringify([...materiasCompletadas]));
}

function crearMateriaCard(materia, todasMaterias) {
  const card = document.createElement("div");
  card.className = "materia";
  card.id = materia.codigo;

  const prerrequisitosCumplidos = materia.prerrequisitos.every(pr => materiasCompletadas.has(pr));
  const bloqueada = materia.prerrequisitos.length > 0 && !prerrequisitosCumplidos;

  if (materiasCompletadas.has(materia.nombre)) {
    card.classList.add("completada");
  } else if (bloqueada) {
    card.classList.add("bloqueada");
  }

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

  card.addEventListener("click", () => {
    if (bloqueada) {
      alert("No puedes completar esta materia hasta cumplir los prerrequisitos.");
      return;
    }

    if (materiasCompletadas.has(materia.nombre)) {
      materiasCompletadas.delete(materia.nombre);
      card.classList.remove("completada");
    } else {
      materiasCompletadas.add(materia.nombre);
      card.classList.add("completada");
    }

    guardarEstado();
    actualizarMalla(todasMaterias); // refrescar estado
  });

  return card;
}

function actualizarMalla(data) {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  const semestres = {};
  data.forEach(materia => {
    if (!semestres[materia.semestre]) {
      semestres[materia.semestre] = [];
    }
    semestres[materia.semestre].push(materia);
  });

  Object.keys(semestres).sort((a, b) => a - b).forEach(semestre => {
    const box = document.createElement("div");
    box.className = "semestre-box";
    box.innerHTML = `<h2>Semestre ${semestre}</h2>`;

    semestres[semestre].forEach(materia => {
      const card = crearMateriaCard(materia, data);
      box.appendChild(card);
    });

    container.appendChild(box);
  });
}

fetch("malla_interactiva_corregida.json")
  .then(response => response.json())
  .then(data => {
    actualizarMalla(data);
  });
