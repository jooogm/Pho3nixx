document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cursos-container");

  Object.values(CURSOS)
    .filter(curso => curso.destaque)
    .forEach(curso => {
      const card = document.createElement("div");
      card.innerHTML = `
        <h3>${curso.titulo}</h3>
        <p>${curso.descricao}</p>
        <a href="detalhes_cursos.html?id=${curso.id}">Ver Curso</a>
        <hr>
      `;
      container.appendChild(card);
    });
});
