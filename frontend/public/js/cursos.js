document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cursos-container");

  Object.values(CURSOS)
    .filter((curso) => curso.destaque)
    .forEach((curso) => {
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

      container.appendChild(card);
    });
});
