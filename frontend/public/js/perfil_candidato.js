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
    document.getElementById("localizacao").textContent =
      profile?.localizacao || "Não informado";
    document.getElementById("contato").textContent =
      profile?.contato || "Não informado";
    document.getElementById("especializacao").textContent =
      profile?.especializacao || "Não informado";
    document.getElementById("resumo").textContent =
      profile?.resumo || "Não informado";
    document.getElementById("curriculo").href = profile?.link_curriculo || "#";
    document.getElementById("curriculo").textContent = profile?.link_curriculo
      ? "Ver Currículo"
      : "Nenhum currículo disponível";
    document.getElementById("avatar").src = profile?.avatar?.startsWith(
      "data:image/"
    )
      ? profile.avatar
      : profile?.avatar
      ? `data:image/jpeg;base64,${profile.avatar}`
      : "https://www.gravatar.com/avatar/placeholder?s=120";

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
