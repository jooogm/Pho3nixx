document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const vagaId = params.get("vaga_id");
  const token = localStorage.getItem("token");
  const container = document.getElementById("candidatos-container");

  if (!token || !vagaId) {
    container.innerHTML =
      "<p class='text-danger'>Token de acesso ou ID da vaga não fornecido.</p>";
    return;
  }

  try {
    const res = await fetch(
      `${window.API_URL}/api/inscricoes/candidatos/${vagaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const dados = await res.json();
    const candidatos = Array.isArray(dados) ? dados : dados.candidatos || [];

    if (!res.ok || candidatos.length === 0) {
      container.innerHTML = `<p style="color: white; text-align: center;">Nenhum candidato encontrado para esta vaga.</p>`;
      return;
    }

    //console.log("🔎 Dados recebidos:", candidatos);

    candidatos.forEach((c) => {
      const user = c.user;
      const perfil = user.profile;

      const nomeCompleto = `${user.name} ${perfil?.nome_completo || ""}`;
      const userId = user.id;

      const card = document.createElement("div");
      card.className = "candidato-card";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <h5>${c.user.name} ${c.user.profile?.nome_completo || ""}</h5>
        <p><strong>Email:</strong> ${c.user.email}</p>
        <p><strong>Contato:</strong> ${
          c.user.profile?.contato || "Não informado"
        }</p>
        <p><strong>Especialização:</strong> ${
          c.user.profile?.especializacao || "Não informado"
        }</p>
        <label for="status-${
          c.inscricao_id
        }"><strong>Status da inscrição:</strong></label>
<select id="status-${c.inscricao_id}" data-id="${c.inscricao_id}">
  ${["em andamento", "processo seletivo", "aprovado", "encerrado"]
    .map(
      (status) =>
        `<option value="${status}" ${
          c.status_inscricao === status ? "selected" : ""
        }>${status}</option>`
    )
    .join("")}
</select>
       
      `;

      // ⛔ Impede que clique no select ative o clique do card
      card
        .querySelector("select")
        .addEventListener("click", (e) => e.stopPropagation());

      // Adicionar evento de mudança para os selects
      card.querySelector("select").addEventListener("change", async (e) => {
        const novoStatus = e.target.value;
        const inscricaoId = e.target.dataset.id;

        try {
          const res = await fetch(
            `${window.API_URL}/api/inscricoes/status/${inscricaoId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ novoStatus }),
            }
          );

          const data = await res.json();
          if (res.ok) {
            alert("Status atualizado com sucesso!");
          } else {
            alert(`Erro: ${data.message}`);
          }
        } catch (err) {
          console.error("Erro ao atualizar status:", err);
          alert("Erro ao atualizar status da inscrição.");
        }
      });

      card.addEventListener("click", () => {
        window.location.href = `perfil_candidato.html?id=${userId}&inscricao=${c.inscricao_id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar candidatos:", err);
    container.innerHTML =
      "<p class='text-danger'>Erro ao carregar candidatos. Tente novamente.</p>";
  }
});
