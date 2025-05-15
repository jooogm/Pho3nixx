document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const vagaId = params.get("vaga_id");
  const token = localStorage.getItem("token");
  const container = document.getElementById("candidatos-container");

  if (!token || !vagaId) {
    container.innerHTML = "<p class='text-danger'>Token de acesso ou ID da vaga não fornecido.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/inscricoes/candidatos/${vagaId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const dados = await res.json();
const candidatos = Array.isArray(dados) ? dados : dados.candidatos || [];

    if (!res.ok || candidatos.length === 0) {
      container.innerHTML = "<p>Nenhum candidato encontrado para esta vaga.</p>";
      return;
    }

//console.log("🔎 Dados recebidos:", candidatos);

    candidatos.forEach(c => {
      const card = document.createElement("div");
      card.className = "candidato-card";

      card.innerHTML = `
        <h5>${c.user.name} ${c.user.profile?.nome_completo || ""}</h5>
        <p><strong>Email:</strong> ${c.user.email}</p>
        <p><strong>Contato:</strong> ${c.user.profile?.contato || "Não informado"}</p>
        <p><strong>Especialização:</strong> ${c.user.profile?.especializacao || "Não informado"}</p>
        <p><strong>Status da inscrição:</strong> ${c.user.status_inscricao || "em andamento"}</p>
        <p><strong>Currículo:</strong> <a href="${c.user.profile?.link_curriculo || "#"}" target="_blank">Ver Currículo</a></p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar candidatos:", err);
    container.innerHTML = "<p class='text-danger'>Erro ao carregar candidatos. Tente novamente.</p>";
  }
});