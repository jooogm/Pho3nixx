document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cursoId = params.get("id");

  const curso = CURSOS[cursoId];

  if (!curso) {
    document.body.innerHTML = "<p>Curso não encontrado.</p>";
    return;
  }

  document.getElementById("titulo").textContent = curso.titulo;
  document.getElementById("descricao").textContent = curso.descricao;
  document.getElementById("video").src = curso.video;

  const lista = document.getElementById("competencias");
  curso.competencias.forEach(comp => {
    const li = document.createElement("li");
    li.textContent = comp;
    lista.appendChild(li);
  });

  document.getElementById("concluirCurso").addEventListener("click", () => {
    const github = prompt("Cole aqui o link do seu projeto no GitHub:");
    if (github) {
      alert("Projeto enviado com sucesso!");
      // Aqui você pode conectar com backend depois
      console.log("Curso:", cursoId, "GitHub:", github);
    }
  });
});
