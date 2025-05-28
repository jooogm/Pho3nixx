async function obterNomeEstadoPorId(id) {
  try {
    const response = await fetch("Estados.json");
    const estados = await response.json();
    const estado = estados.find((e) => e.ID.toString() === id.toString());
    return estado ? `${estado.Nome} (${estado.Sigla})` : "Desconhecido";
  } catch (e) {
    console.warn("Erro ao buscar estado:", e);
    return "-";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const vagaId = params.get("id");
  const token = localStorage.getItem("token");

  if (!vagaId || !token) {
    alert("Vaga ou token não encontrado.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/vagas/${vagaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao carregar detalhes da vaga.");

    const vaga = await response.json();

    // Requisitos formatados
    const listaRequisitos = vaga.requisitos
      ? vaga.requisitos
          .split(",")
          .map((req) => `<li>${req.trim()}</li>`)
          .join("")
      : "<li>Não informado</li>";

    // Estado formatado se aplicável
    let estadoCidadeHTML = "";
    if (vaga.modalidade === "Presencial" || vaga.modalidade === "Híbrido") {
      const nomeEstado = await obterNomeEstadoPorId(vaga.estado);
      estadoCidadeHTML = `
        <p><strong>Estado:</strong> ${nomeEstado}</p>
        <p><strong>Cidade:</strong> ${vaga.cidade || "Não informado"}</p>
      `;
    }

    // Cursos formatados
    let listaCursos = "<li>Não indicado</li>";
    if (
      Array.isArray(vaga.cursos_indicados) &&
      vaga.cursos_indicados.length > 0
    ) {
      listaCursos = vaga.cursos_indicados
        .map((curso) => `<li>${curso}</li>`)
        .join("");
    }

    document.getElementById("detalhes-vaga").innerHTML = `
      <h2>${vaga.titulo}</h2>
      <p><strong>Descrição:</strong> ${vaga.descricao}</p>
      <p><strong>Modalidade:</strong> ${vaga.modalidade || "Não informada"}</p>
      ${estadoCidadeHTML}
      <p><strong>Requisitos:</strong></p>
      <ul>${listaRequisitos}</ul>
       <p><strong>Cursos Recomendados:</strong></p>
  <ul>${listaCursos}</ul>
      <p><strong>Salário:</strong> R$ ${vaga.salario}</p>
      <p><strong>Status:</strong> ${vaga.status}</p>
    `;

    document
      .getElementById("btn-inscrever")
      .addEventListener("click", async () => {
        try {
          const inscrever = await fetch(
            `http://localhost:3000/api/inscricoes/candidatar/${vagaId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ vagaId }),
            }
          );

          if (!inscrever.ok) {
            const erro = await inscrever.json();
            alert("Erro ao se inscrever: " + erro.message);
            return;
          }

          alert("Inscrição realizada com sucesso!");
        } catch (erro) {
          console.error("Erro ao se inscrever:", erro);
        }
      });
  } catch (erro) {
    console.error("Erro ao carregar detalhes da vaga:", erro);
  }
});
