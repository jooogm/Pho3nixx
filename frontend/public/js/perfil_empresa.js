document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const empresaProfileId = urlParams.get("empresa") || urlParams.get("id"); // pega ?empresa=6 ou ?id=6
  const token = localStorage.getItem("token");

  if (!empresaProfileId) {
    alert("ID da empresa não informado na URL.");
    return;
  }

  try {
    // 1. Buscar perfil da empresa (rota pública)
    const perfilRes = await fetch(`http://localhost:3000/api/usuarios/empresa/${empresaProfileId}`);
    if (!perfilRes.ok) throw new Error("Erro ao carregar perfil da empresa.");

    const perfilData = await perfilRes.json();
    const empresa = perfilData.user.profile;

    // 2. Exibir dados no HTML
    document.getElementById("nome_empresa").textContent = empresa.nome_completo;
    document.getElementById("localizacao_empresa").textContent = empresa.localizacao || "Não informada";
    document.getElementById("contato_empresa").textContent = empresa.contato || "Não informado";
    document.getElementById("resumo_empresa").textContent = empresa.resumo || "Sem descrição.";

    // 3. Buscar vagas abertas da empresa
    const vagasRes = await fetch(`http://localhost:3000/api/vagas/abertas?empresa_id=${empresaProfileId}`);
    if (!vagasRes.ok) throw new Error("Erro ao carregar vagas da empresa.");

    const vagas = await vagasRes.json();
    const vagasContainer = document.getElementById("vagas-lista");

    if (!Array.isArray(vagas) || vagas.length === 0) {
      vagasContainer.innerHTML = `<p class="text-muted">Nenhuma vaga cadastrada ainda.</p>`;
      return;
    }

    // 4. Exibir as vagas
    vagas.forEach(vaga => {
      const card = document.createElement("div");
      card.className = "col-md-6 mb-4";

      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">
            <a href="vaga.html?id=${vaga.vaga_id}">${vaga.titulo}</a>
            </h5>
            <p class="card-text"><strong>Local:</strong> ${vaga.localizacao}</p>
            <p class="card-text">${vaga.descricao.slice(0, 100)}...</p>
          </div>
        </div>
      `;
      vagasContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar o perfil ou vagas da empresa.");
  }
});
