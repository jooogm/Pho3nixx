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
    if (estado.ID.toString() === estadoAtual?.toString()) opt.selected = true;
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

// ---------------------- REQUISITOS ----------------------

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

// ---------------------- CURSOS INDICADOS ----------------------

let cursosSelecionados = [];
const selectCursos = document.getElementById("cursos-select");
const inputCursos = document.getElementById("cursos_indicados");
const tagsContainerCursos = document.getElementById("cursos-tags");
const checkIndicarCursos = document.getElementById("indicar-cursos");
const wrapperCursos = document.getElementById("wrapper-cursos");

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

function inicializarCursos(cursosSalvos) {
  if (!tagsContainerCursos || !inputCursos || !selectCursos) return;

  if (window.CURSOS) {
    Object.values(window.CURSOS).forEach((curso) => {
      const opt = document.createElement("option");
      opt.value = curso.titulo;
      opt.textContent = curso.titulo;
      selectCursos.appendChild(opt);
    });
  }

  cursosSelecionados = Array.isArray(cursosSalvos) ? cursosSalvos : [];

  if (cursosSelecionados.length > 0) {
    checkIndicarCursos.checked = true;
    wrapperCursos.style.display = "block";
  }

  atualizarTagsCursos();

  selectCursos.addEventListener("change", (e) => {
    const novo = e.target.value;
    if (novo && !cursosSelecionados.includes(novo)) {
      cursosSelecionados.push(novo);
      atualizarTagsCursos();
    }
    e.target.selectedIndex = 0;
  });
}

checkIndicarCursos.addEventListener("change", () => {
  wrapperCursos.style.display = checkIndicarCursos.checked ? "block" : "none";
});

// ---------------------- DOM READY ----------------------

document.addEventListener("DOMContentLoaded", async () => {
  const modalidadeSelect = document.getElementById("modalidade");
  const estadoWrapper = document.getElementById("wrapper-estado");
  const cidadeWrapper = document.getElementById("wrapper-cidade");

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
      headers: { Authorization: `Bearer ${token}` },
    });

    const vaga = await response.json();

    if (!response.ok) {
      mensagem.textContent = vaga.message || "❌ Erro ao carregar vaga.";
      return;
    }

    await carregarEstadosECidades(vaga.estado, vaga.cidade);
    atualizarVisibilidadeLocalizacao();

    for (const key in vaga) {
      if (form.elements[key]) {
        form.elements[key].value = vaga[key];
      }
    }

    inicializarRequisitos(vaga.requisitos);
    inicializarCursos(vaga.cursos_indicados);
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
    data.cursos_indicados = JSON.parse(inputCursos.value || "[]");

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
