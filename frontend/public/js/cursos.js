document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cursos-container");

  const cursosDestaque = Object.values(CURSOS).filter(
    (curso) => curso.destaque
  );
  console.log("Cursos em destaque:", cursosDestaque);

  const primeiros4 = cursosDestaque.slice(0, 4);
  const restantes = cursosDestaque.slice(4);

  // Função pra criar card
  const criarCard = (curso) => {
    const card = document.createElement("div");
    card.classList.add("curso-card");
    card.setAttribute("data-aos", "fade-up");
    card.innerHTML = `
      <h5>${curso.titulo}</h5>
      <p>${curso.descricao}</p>
      <a href="detalhes_cursos.html?id=${curso.id}" class="btn-detalhes">
        <i class="bi bi-book"></i> Ver Curso
      </a>
    `;
    return card;
  };

  // Adiciona os 4 primeiros
  primeiros4.forEach((curso) => {
    container.appendChild(criarCard(curso));
  });

  // Se tiver mais que 4, adiciona quebra de linha visual
  if (restantes.length > 0) {
    const separador = document.createElement("div");
    separador.style.width = "100%";
    separador.style.margin = "20px 0";
    container.appendChild(separador);

    restantes.forEach((curso) => {
      container.appendChild(criarCard(curso));
    });
  }
});
