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

// lógica para requisitos (mesma ideia das especializações)
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

if (selectRequisitos && window.ESPECIALIZACOES) {
  window.ESPECIALIZACOES.forEach((esp) => {
    const opt = document.createElement("option");
    opt.value = esp;
    opt.textContent = esp;
    selectRequisitos.appendChild(opt);
  });

  selectRequisitos.addEventListener("change", (e) => {
    const novo = e.target.value;
    if (novo && !requisitosSelecionados.includes(novo)) {
      requisitosSelecionados.push(novo);
      atualizarTagsRequisitos();
    }
    e.target.selectedIndex = 0;
  });
}

// ----DOMContentLoaded---- //
document.addEventListener("DOMContentLoaded", () => {
  const modalidadeSelect = document.getElementById("modalidade");
  const estadoWrapper = document.getElementById("wrapper-estado");
  const cidadeWrapper = document.getElementById("wrapper-cidade");

  carregarEstadosECidades();

  function atualizarVisibilidadeLocalizacao() {
    const valor = modalidadeSelect.value;
    const mostrar = valor === "Presencial" || valor === "Híbrido";
    estadoWrapper.style.display = mostrar ? "block" : "none";
    cidadeWrapper.style.display = mostrar ? "block" : "none";
  }

  modalidadeSelect.addEventListener("change", atualizarVisibilidadeLocalizacao);
  atualizarVisibilidadeLocalizacao();

  // Adicionar evento de submit para garantir que os dados sejam incluídos no payload
  const form = document.getElementById("form-vaga");
  if (form) {
    form.addEventListener("submit", () => {
      const estado = document.getElementById("estado")?.value;
      const cidade = document.getElementById("cidade")?.value;
      const modalidade = document.getElementById("modalidade")?.value;

      // Adicionar campos ao formData
      const hiddenEstado = document.createElement("input");
      hiddenEstado.type = "hidden";
      hiddenEstado.name = "estado";
      hiddenEstado.value = estado;
      form.appendChild(hiddenEstado);

      const hiddenCidade = document.createElement("input");
      hiddenCidade.type = "hidden";
      hiddenCidade.name = "cidade";
      hiddenCidade.value = cidade;
      form.appendChild(hiddenCidade);

      const hiddenModalidade = document.createElement("input");
      hiddenModalidade.type = "hidden";
      hiddenModalidade.name = "modalidade";
      hiddenModalidade.value = modalidade;
      form.appendChild(hiddenModalidade);
    });
  }

  // Preencher o select de requisitos com as especializações disponíveis
  const selectRequisitos = document.getElementById("requisitos");
  if (window.ESPECIALIZACOES && selectRequisitos) {
    window.ESPECIALIZACOES.forEach((esp) => {
      const opt = document.createElement("option");
      opt.value = esp;
      opt.textContent = esp;
      selectRequisitos.appendChild(opt);
    });
  }

  document
    .getElementById("form-vaga")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      data.requisitos = document.getElementById("requisitos").value; // Adicionando requisitos

      try {
        const response = await fetch("http://localhost:3000/api/vagas/criar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          document.getElementById("mensagem").innerText =
            "Vaga criada com sucesso!";
          this.reset();
        } else {
          document.getElementById("mensagem").innerText =
            result.message || "Erro ao criar vaga.";
        }
      } catch (error) {
        console.error("Erro ao enviar vaga:", error);
        document.getElementById("mensagem").innerText = "Erro de conexão.";
      }
    });
});
