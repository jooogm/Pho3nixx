document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const inscricaoId = params.get("inscricao");
  const token = localStorage.getItem("token");

  if (!inscricaoId || !token) {
    document.body.innerHTML =
      "<p>ID da inscrição não informado ou usuário não autenticado.</p>";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/inscricoes/detalhes/${inscricaoId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao buscar dados.");

    const user = data.user;
    const profile = user.profile;
    const statusAtual = data.status_inscricao;

    document.getElementById("nome").textContent = `${user.name} ${
      profile?.nome_completo || ""
    }`;
    document.getElementById("email").textContent = user.email;
    if (profile?.estado) {
      await mostrarNomeEstadoPorId(profile.estado);
    } else {
      document.getElementById("estado").textContent = "Não informado";
    }
    document.getElementById("cidade").textContent =
      profile?.cidade || "Não informado";
    document.getElementById("contato").textContent =
      profile?.contato || "Não informado";
    document.getElementById("especializacao").textContent =
      profile?.especializacao || "Não informado";
    document.getElementById("resumo").textContent =
      profile?.resumo || "Não informado";
    document.getElementById("avatar").src = profile?.avatar?.startsWith(
      "data:image/"
    )
      ? profile.avatar
      : profile?.avatar
      ? `data:image/jpeg;base64,${profile.avatar}`
      : "https://www.gravatar.com/avatar/placeholder?s=120";

    // Redes sociais
    let redes = {};
    try {
      redes = JSON.parse(profile?.redes_sociais || "{}");
    } catch (e) {
      console.warn("Erro ao ler redes_sociais:", e);
    }

    // Avatar
    document.getElementById("avatar").src = profile?.avatar?.startsWith(
      "data:image/"
    )
      ? profile.avatar
      : profile?.avatar
      ? `data:image/jpeg;base64,${profile.avatar}`
      : "https://www.gravatar.com/avatar/placeholder?s=120";

    // GitHub
    const githubEl = document.getElementById("github");
    if (githubEl) {
      githubEl.innerHTML = profile?.github_perfil
        ? `<a href="${profile.github_perfil}" target="_blank">${profile.github_perfil}</a>`
        : "Não informado";
    }

    // Instagram
    document.getElementById("instagram").innerHTML = redes.instagram
      ? (() => {
          const url = new URL(redes.instagram);
          const usuario = url.pathname.replaceAll("/", "");
          return `<a href="${redes.instagram}" target="_blank">@${usuario}</a>`;
        })()
      : "Não informado";

    // Projetos
    const projetosContainer = document.getElementById("projetos");
    if (profile?.projetos) {
      try {
        const projetos = JSON.parse(profile.projetos);
        projetosContainer.innerHTML = projetos
          .map(
            (p) =>
              `<li><strong>${p.nome}</strong>: <a href="${p.link}" target="_blank">${p.link}</a></li>`
          )
          .join("");
      } catch {
        projetosContainer.innerHTML = "<li>Erro ao carregar projetos.</li>";
      }
    } else {
      projetosContainer.innerHTML = "<li>Nenhum projeto informado.</li>";
    }

    // Cursos concluídos
    const cursosContainer = document.getElementById("cursos");
    if (profile?.cursos_concluidos) {
      try {
        const cursos = JSON.parse(profile.cursos_concluidos);
        cursosContainer.innerHTML = cursos
          .map(
            (c) =>
              `<li><strong>${c.curso}</strong>: <a href="${c.repositorio}" target="_blank">${c.repositorio}</a></li>`
          )
          .join("");
      } catch {
        cursosContainer.innerHTML = "<li>Erro ao carregar cursos.</li>";
      }
    } else {
      cursosContainer.innerHTML = "<li>Nenhum curso concluído informado.</li>";
    }

    // Preencher status
    const statusSelect = document.getElementById("status");
    if (statusSelect) {
      statusSelect.value = statusAtual;

      statusSelect.addEventListener("change", async (e) => {
        const novoStatus = e.target.value;

        const update = await fetch(
          `http://localhost:3000/api/inscricoes/status/${inscricaoId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ novoStatus }),
          }
        );

        const result = await update.json();
        if (update.ok) {
          alert("Status atualizado com sucesso!");
        } else {
          alert("Erro: " + result.message);
        }
      });
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
    document.body.innerHTML = "<p>Erro ao carregar perfil do candidato.</p>";
  }
});
// Função para mostrar nome do estado
async function mostrarNomeEstadoPorId(id) {
  try {
    const response = await fetch("Estados.json");
    const estados = await response.json();
    const estadoEncontrado = estados.find(
      (e) => e.ID === id || e.ID.toString() === id.toString()
    );
    document.getElementById("estado").textContent = estadoEncontrado
      ? `${estadoEncontrado.Nome} (${estadoEncontrado.Sigla})`
      : "Desconhecido";
  } catch {
    document.getElementById("estado").textContent = "-";
  }
}
