async function carregarEstadosECidades(estadoAtual = "", cidadeAtual = "") {
  const estadosResp = await fetch("./Estados.json");
  const cidadesResp = await fetch("./Cidades.json");
  const estados = await estadosResp.json();
  const cidades = await cidadesResp.json();

  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  estados.forEach((estado) => {
    const opt = document.createElement("option");
    opt.value = estado.ID;
    opt.textContent = `${estado.Nome} (${estado.Sigla})`;
    if (estado.ID.toString() === estadoAtual.toString()) opt.selected = true;
    estadoSelect.appendChild(opt);
  });

  function popularCidadesPorEstadoId(estadoId) {
    cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
    const cidadesFiltradas = cidades.filter((c) => c.Estado === estadoId);
    cidadesFiltradas.forEach((cidade) => {
      const opt = document.createElement("option");
      opt.value = cidade.Nome;
      opt.textContent = cidade.Nome;
      if (cidade.Nome === cidadeAtual) opt.selected = true;
      cidadeSelect.appendChild(opt);
    });
    cidadeSelect.disabled = false;
  }

  if (estadoAtual) {
    popularCidadesPorEstadoId(estadoAtual);
  }

  estadoSelect.addEventListener("change", () => {
    cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
    const estadoSelecionado = estadoSelect.value;
    if (estadoSelecionado) {
      popularCidadesPorEstadoId(estadoSelecionado);
    } else {
      cidadeSelect.disabled = true;
    }
  });
}

let requisitosSelecionados = [];
const tagsContainerRequisitos = document.getElementById("requisitos-tags");
const inputRequisitos = document.getElementById("requisitos");
const selectRequisitos = document.getElementById("requisitos-select");

function atualizarTagsRequisitos() {
  tagsContainerRequisitos.innerHTML = "";
  requisitosSelecionados.forEach((req) => {
    const tag = document.createElement("span");
    tag.className =
      "badge bg-warning text-dark px-2 py-1 rounded d-flex align-items-center me-2";
    tag.dataset.value = req;
    tag.innerHTML = `${req} <span class="ms-2" style="cursor:pointer;">&times;</span>`;
    tag.querySelector("span").addEventListener("click", () => {
      requisitosSelecionados = requisitosSelecionados.filter((r) => r !== req);
      atualizarTagsRequisitos();
    });
    tagsContainerRequisitos.appendChild(tag);
  });
  inputRequisitos.value = requisitosSelecionados.join(", ");
}

function inicializarRequisitos(requisitosSalvos) {
  if (!tagsContainerRequisitos || !inputRequisitos || !selectRequisitos) return;

  requisitosSelecionados = requisitosSalvos
    ? requisitosSalvos
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  atualizarTagsRequisitos();

  if (window.ESPECIALIZACOES) {
    window.ESPECIALIZACOES.forEach((esp) => {
      const opt = document.createElement("option");
      opt.value = esp;
      opt.textContent = esp;
      selectRequisitos.appendChild(opt);
    });
  }

  selectRequisitos.addEventListener("change", (e) => {
    const novo = e.target.value;
    if (novo && !requisitosSelecionados.includes(novo)) {
      requisitosSelecionados.push(novo);
      atualizarTagsRequisitos();
    }
    e.target.selectedIndex = 0;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get("id");

  const mensagem = document.getElementById("mensagem");
  const form = document.getElementById("form-editar-vaga");

  if (!vagaId) {
    mensagem.textContent = "❌ Vaga não encontrada.";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para editar uma vaga.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/vagas/${vagaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const vaga = await response.json();

    if (!response.ok) {
      mensagem.textContent = vaga.message || "❌ Erro ao carregar vaga.";
      return;
    }

    // CARREGAR E SELECIONAR OS VALORES DE ESTADO E CIDADE
    await carregarEstadosECidades(vaga.estado, vaga.cidade);

    for (const key in vaga) {
      if (form.elements[key]) {
        form.elements[key].value = vaga[key];
      }
    }

    inicializarRequisitos(vaga.requisitos);
  } catch (err) {
    console.error(err);
    mensagem.textContent = "❌ Erro ao buscar vaga.";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    data.requisitos = requisitosSelecionados.join(", ");

    try {
      const updateResponse = await fetch(
        `http://localhost:3000/api/vagas/${vagaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        mensagem.textContent = "✅ Vaga atualizada com sucesso!";
      } else {
        mensagem.textContent =
          updateResult.message || "❌ Erro ao atualizar vaga.";
      }
    } catch (error) {
      console.error(error);
      mensagem.textContent = "❌ Erro na requisição.";
    }
  });
});
