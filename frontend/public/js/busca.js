document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const termo = params.get("termo");
  const token = localStorage.getItem("token");

  if (!termo || !token) return;

  try {
    const response = await fetch(
      `http://localhost:3000/api/vagas?titulo=${encodeURIComponent(termo)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const vagas = await response.json();

    const container = document.getElementById("resultados-vagas");
    container.innerHTML = "";

    if (vagas.length === 0) {
      container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
      return;
    }

    vagas.forEach((vaga) => {
      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">
  <a href="vaga.html?id=${vaga.vaga_id}">${vaga.titulo}</a>
</h5>
          <p class="card-text">${vaga.descricao || ""}</p>
          <p class="card-text"><strong>Empresa:</strong> 
            <a href="perfil_empresa.html?id=${vaga.empresa_id}">${
        vaga.empresa_nome
      } </a>
          </p>
          <p class="card-text"><strong>Localização:</strong> ${
            vaga.localizacao
          }</p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
  }
});
