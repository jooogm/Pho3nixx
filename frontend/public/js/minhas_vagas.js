document.addEventListener("DOMContentLoaded", () => {
  const vagasContainer = document.getElementById("vagas-container");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:3000/api/vagas/minhas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar vagas");
      return res.json();
    })
    .then((vagas) => {
      if (vagas.length === 0) {
        vagasContainer.innerHTML =
          '<p style="color:white;">Nenhuma vaga cadastrada.</p>';
        return;
      }

      vagas.forEach((vaga) => {
        const vagaCard = document.createElement("div");
        vagaCard.className = "vaga-card";
        vagaCard.setAttribute("data-aos", "fade-up");

        vagaCard.innerHTML = `
          <h4>${vaga.titulo}</h4>
          <p><strong>Descrição:</strong> ${vaga.descricao}</p>
          <p><strong>Localização:</strong> ${vaga.localizacao}</p>
          <p><strong>Salário:</strong> R$ ${vaga.salario}</p>
          <p><strong>Tipo de contrato:</strong> ${vaga.tipo_contrato}</p>
          <p><strong>Status:</strong> ${vaga.status}</p>
          <div class="mt-3">
            <a href="editar_vaga.html?id=${vaga.vaga_id}" class="btn btn-edit">Editar</a>
            <button class="btn btn-delete" onclick="deletarVaga(${vaga.vaga_id})">Excluir</button>
            <a href="candidatos.html?vaga_id=${vaga.vaga_id}" class="btn btn-orange-rect">Ver Candidatos</a>
          </div>
        `;

        vagasContainer.appendChild(vagaCard);
      });

      // ✅ Ativa o AOS após os cards serem inseridos
      AOS.refresh();
    })
    .catch((error) => {
      console.error("Erro ao carregar vagas:", error);
      vagasContainer.innerHTML =
        '<p style="color:white;">Erro ao carregar vagas.</p>';
    });
});

function deletarVaga(id) {
  if (confirm("Tem certeza que deseja excluir esta vaga?")) {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/api/vagas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir vaga");
        alert("Vaga excluída com sucesso!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao excluir vaga:", error);
        alert("Erro ao excluir vaga.");
      });
  }
}
