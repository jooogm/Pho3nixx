document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const container = document.getElementById("candidaturas-container");

  if (!token) {
    container.innerHTML =
      '<p class="text-danger">Você precisa estar logado para ver suas candidaturas.</p>';
    return;
  }

  fetch(`${window.API_URL}/api/inscricoes/acompanhamento`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erro ao carregar candidaturas");

      if (Array.isArray(data)) {
        if (data.length === 0) {
          container.innerHTML =
            "<p>Você ainda não se inscreveu em nenhuma vaga.</p>";
        } else {
          data.forEach((inscricao) => {
            const col = document.createElement("div");
            col.classList.add("col-md-6");

            col.innerHTML = `
              <div class="vaga-card">
                <div class="card-body">
                  <h5 class="card-title">
                    <a href="vaga.html?id=${
                      inscricao.vaga_id
                    }" class="text-decoration-none">
                      ${inscricao.vaga?.titulo || "Título não disponível"}
                    </a>
                  </h5>
                  <p class="card-text">${
                    inscricao.vaga?.descricao || "Sem descrição"
                  }</p>
                  <p><strong>Status:</strong> ${inscricao.status_inscricao}</p>
                  <button class="btn btn-cancelar" onclick="cancelarInscricao(${
                    inscricao.inscricao_id
                  })">Cancelar</button>
                </div>
              </div>
            `;
            container.appendChild(col);
          });
        }
      } else {
        container.innerHTML = `<p>${data.message}</p>`;
      }
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = `<p class="text-danger">Erro: ${err.message}</p>`;
    });
});

function cancelarInscricao(inscricaoId) {
  if (!confirm("Tem certeza que deseja cancelar essa inscrição?")) return;

  const token = localStorage.getItem("token");

  fetch(`${window.API_URL}/api/inscricoes/cancelar/${inscricaoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
      alert("Erro ao cancelar inscrição.");
    });
}
