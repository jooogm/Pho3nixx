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

  // Faz que não seja obrigatório o estado e a cidade quando a modalidade for remota
  function atualizarVisibilidadeLocalizacao() {
    const valor = modalidadeSelect.value;
    const mostrar = valor === "Presencial" || valor === "Híbrido";

    estadoWrapper.style.display = mostrar ? "block" : "none";
    cidadeWrapper.style.display = mostrar ? "block" : "none";

    const estadoSelect = document.getElementById("estado");
    const cidadeSelect = document.getElementById("cidade");

    if (mostrar) {
      estadoSelect.setAttribute("required", true);
      cidadeSelect.setAttribute("required", true);
    } else {
      estadoSelect.removeAttribute("required");
      cidadeSelect.removeAttribute("required");
    }
  }

  modalidadeSelect.addEventListener("change", atualizarVisibilidadeLocalizacao);
  atualizarVisibilidadeLocalizacao();

  // Elementos cursos
  const checkIndicarCursos = document.getElementById("indicar-cursos");
  const wrapperCursos = document.getElementById("wrapper-cursos");
  const selectCursos = document.getElementById("cursos-select");
  const inputCursos = document.getElementById("cursos_indicados");
  const tagsContainerCursos = document.getElementById("cursos-tags");

  let cursosSelecionados = [];

  checkIndicarCursos.addEventListener("change", () => {
    wrapperCursos.style.display = checkIndicarCursos.checked ? "block" : "none";
  });

  if (window.CURSOS) {
    Object.values(window.CURSOS).forEach((curso) => {
      const opt = document.createElement("option");
      opt.value = curso.titulo;
      opt.textContent = curso.titulo;
      selectCursos.appendChild(opt);
    });
  }

  function atualizarTagsCursos() {
    tagsContainerCursos.innerHTML = "";
    cursosSelecionados.forEach((curso) => {
      const tag = document.createElement("span");
      tag.className =
        "badge bg-info text-dark px-2 py-1 rounded d-flex align-items-center me-2";
      tag.dataset.value = curso;
      tag.innerHTML = `${curso} <span class="ms-2" style="cursor:pointer;">&times;</span>`;
      tag.querySelector("span").addEventListener("click", () => {
        cursosSelecionados = cursosSelecionados.filter((c) => c !== curso);
        atualizarTagsCursos();
      });
      tagsContainerCursos.appendChild(tag);
    });
    inputCursos.value = JSON.stringify(cursosSelecionados);
  }

  selectCursos.addEventListener("change", (e) => {
    const novo = e.target.value;
    if (novo && !cursosSelecionados.includes(novo)) {
      cursosSelecionados.push(novo);
      atualizarTagsCursos();
    }
    e.target.selectedIndex = 0;
  });
});

document
  .getElementById("form-vaga")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    // Captura os campos adicionais que não estão diretamente no form
    const estado = document.getElementById("estado")?.value;
    const cidade = document.getElementById("cidade")?.value;
    const modalidade = document.getElementById("modalidade")?.value;
    const requisitos = document.getElementById("requisitos")?.value;

    // Captura os cursos indicados, se houver

    // Monta o payload de forma manual (ao invés de depender do FormData que ignora campos dinâmicos)
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    // Força os campos extras no objeto data
    data.estado = estado;
    data.cidade = cidade;
    data.modalidade = modalidade;
    data.requisitos = requisitos;
    data.cursos_indicados = JSON.parse(
      document.getElementById("cursos_indicados").value || "[]"
    );

    try {
      const response = await fetch(`${window.API_URL}/api/vagas/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        mensagem.innerText = "Vaga criada com sucesso!";
        mensagem.classList.remove("erro");
        mensagem.classList.add("sucesso");
        this.reset();

        // Aguarda 2 segundos e redireciona para a página de vagas
        setTimeout(() => {
          window.location.href = "minhas_vagas.html";
        }, 2000);
      } else {
        mensagem.innerText = result.message || "Erro ao criar vaga.";
        mensagem.classList.remove("sucesso");
        mensagem.classList.add("erro");
      }
    } catch (error) {
      console.error("Erro ao enviar vaga:", error);
      document.getElementById("mensagem").innerText = "Erro de conexão.";
    }
  });
