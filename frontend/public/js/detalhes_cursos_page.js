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
  curso.competencias.forEach((comp) => {
    const li = document.createElement("li");
    li.textContent = comp;
    lista.appendChild(li);
  });

  document
    .getElementById("concluirCurso")
    .addEventListener("click", async () => {
      const github = prompt("Cole aqui o link do seu projeto no GitHub:");

      if (!github) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para concluir o curso.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const perfil = data.user.profile;

        const cursosAtuais = perfil.cursos_concluidos
          ? JSON.parse(perfil.cursos_concluidos)
          : [];
        cursosAtuais.push({ curso: cursoId, repositorio: github });

        const atualizar = await fetch(
          "http://localhost:3000/api/usuarios/perfil",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cursos_concluidos: cursosAtuais }),
          }
        );

        if (atualizar.ok) {
          alert("Curso concluído salvo com sucesso!");
        } else {
          alert("Erro ao salvar curso.");
        }
      } catch (err) {
        console.error("Erro ao salvar curso:", err);
        alert("Erro ao concluir curso.");
      }
    });
});
