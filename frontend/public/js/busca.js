async function getNomeEstadoPorId(id) {
  if (!id) return "Estado não informado";

  const response = await fetch("/Estados.json");
  const estados = await response.json();

  const estado = estados.find((e) => e.ID.toString() === id.toString());
  return estado ? estado.Nome : "Estado desconhecido";
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const termo = params.get("termo");
  const token = localStorage.getItem("token");

  if (!termo || !token) return;

  try {
    const response = await fetch(
      `${window.API_URL}/api/vagas?titulo=${encodeURIComponent(
        termo
      )}&status=Aberta`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const todasVagas = await response.json();
    const vagas = todasVagas.filter((vaga) => vaga.status === "Aberta");

    const container = document.getElementById("resultados-vagas");
    container.innerHTML = "";

    if (vagas.length === 0) {
      container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
      return;
    }

    for (const vaga of vagas) {
      const nomeEstado = await getNomeEstadoPorId(vaga.estado);

      // Exibe localização apenas se não for remoto
      const localizacaoHTML =
        vaga.modalidade === "Remoto"
          ? ""
          : `<p><strong>Localização:</strong> ${
              vaga.cidade || "Cidade não informada"
            } - ${nomeEstado}</p>`;

      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
  <div class="card-body">
    <h5 class="card-title">
      <a href="vaga.html?id=${vaga.vaga_id}">${vaga.titulo}</a>
    </h5>
    <p class="card-text">${vaga.descricao || ""}</p>
    <p><strong>Empresa:</strong> 
  <a href="perfil_empresa.html?id=${vaga.empresa_id}" class="text-secondary">
  ${vaga.empresa_nome || "Empresa não disponível"}
</a>
</p>
    <p><strong>Modalidade:</strong> ${vaga.modalidade}</p>
    ${localizacaoHTML}
  </div>
`;
      container.appendChild(card);
    }
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
  }
});
