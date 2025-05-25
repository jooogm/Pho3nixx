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

// Carregar cursos do sistema
function carregarCursosDisponiveis() {
  const cursos = window.CURSOS || {};
  const select = document.getElementById("curso_concluido");
  Object.entries(cursos).forEach(([id, curso]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = curso.titulo;
    select.appendChild(option);
  });
}

// Manipular cursos adicionados
function criarCursoConcluido(curso, link) {
  const container = document.getElementById("lista-cursos-concluidos");
  const div = document.createElement("div");
  div.classList.add("mb-2", "curso-item");
  div.innerHTML = `
    <strong>${curso}</strong>: <a href="${link}" target="_blank">${link}</a>
    <button type="button" class="btn btn-sm btn-danger ms-2">Remover</button>
  `;
  div.querySelector("button").addEventListener("click", () => div.remove());
  container.appendChild(div);
}

let especializacoes = [];
let tagsContainer;
let inputHidden;

function atualizarTags() {
  tagsContainer.innerHTML = "";
  especializacoes.forEach((esp) => {
    const tag = document.createElement("span");
    tag.className =
      "badge bg-warning text-dark px-2 py-1 rounded d-flex align-items-center me-2";
    tag.dataset.value = esp;
    tag.innerHTML = `${esp} <span class="ms-2" style="cursor:pointer;">&times;</span>`;
    tag.querySelector("span").addEventListener("click", () => {
      especializacoes = especializacoes.filter((item) => item !== esp);
      atualizarTags();
    });
    tagsContainer.appendChild(tag);
  });
  inputHidden.value = especializacoes.join(", ");
}

function getEspecializacoesAtuais() {
  return especializacoes;
}

function prepararEspecializacaoParaEnvio() {
  return especializacoes.join(", ");
}

function adicionarEspecializacao(esp) {
  if (!especializacoes.includes(esp)) {
    especializacoes.push(esp);
    atualizarTags();
  }
}

function inicializarEspecializacao(especializacaoSalva) {
  tagsContainer = document.getElementById("especializacao-tags");
  inputHidden = document.getElementById("especializacao");
  especializacoes = especializacaoSalva
    ? especializacaoSalva
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
    : [];
  atualizarTags();

  const select = document.getElementById("especializacao-select");
  if (select) {
    select.addEventListener("change", (e) => {
      const nova = e.target.value;
      if (nova) adicionarEspecializacao(nova);
      e.target.selectedIndex = 0; // resetar select
    });
  }
}

// DOM principal

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const avatarInput = document.getElementById("avatar");
  const avatarPreview = document.getElementById("avatarPreview");
  const contatoInput = document.getElementById("contato");

  IMask(contatoInput, {
    mask: "+00 (00) 00000-0000",
  });

  if (!token) {
    alert("Usuário não autenticado!");
    window.location.href = "/login.html";
    return;
  }

  avatarInput.addEventListener("change", function () {
    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        avatarPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  try {
    const res = await fetch("http://localhost:3000/api/usuarios/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const user = data.user;

    // Parse das redes sociais
    let redes = {};
    try {
      redes = JSON.parse(user.profile?.redes_sociais || "{}");
    } catch (e) {
      console.warn("Erro ao ler redes_sociais:", e);
    }

    const nomeField = document.createElement("div");
    nomeField.className = "form-group mb-3";
    nomeField.innerHTML = `
      <label for="nome_publico" class="form-label">Nome</label>
      <input type="text" class="form-control" id="nome_publico" value="${
        user.name || ""
      }" required />
    `;
    const form = document.getElementById("editarPerfilForm");
    form.insertBefore(nomeField, form.firstChild);

    document.getElementById("contato").value = user.profile?.contato || "";
    document.getElementById("resumo").value = user.profile?.resumo || "";
    document.getElementById("instagram").value = redes.instagram || "";
    avatarPreview.src = user.profile?.avatar
      ? user.profile.avatar.startsWith("data:image/")
        ? user.profile.avatar
        : `data:image/jpeg;base64,${user.profile.avatar}`
      : "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";

    await carregarEstadosECidades(
      user.profile?.estado || "",
      user.profile?.cidade || ""
    );
    carregarCursosDisponiveis();

    if (user.type_user_id === 2) {
      document.getElementById("camposProfissional").classList.remove("d-none");
      document.getElementById("nome_completo").value =
        user.profile?.nome_completo || "";
      document.getElementById("especializacao").value =
        user.profile?.especializacao || "";
      document.getElementById("data_nascimento").value =
        user.profile?.data_nascimento || "";
      document.getElementById("github_perfil").value =
        user.profile?.github_perfil || "";

      inicializarEspecializacao(user.profile?.especializacao || "");

      const btnAddCurso = document.getElementById("btnAddCurso");

      btnAddCurso.addEventListener("click", () => {
        const curso = document.getElementById("curso_concluido").value;
        const link = document.getElementById("link_curso").value;
        if (!curso || !link) {
          alert("Selecione um curso e insira o link do projeto.");
          return;
        }
        criarCursoConcluido(curso, link);
        document.getElementById("curso_concluido").value = "";
        document.getElementById("link_curso").value = "";
      });

      const selectEspecializacao = document.getElementById(
        "especializacao-select"
      );
      if (window.ESPECIALIZACOES && selectEspecializacao) {
        window.ESPECIALIZACOES.forEach((item) => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = item;
          selectEspecializacao.appendChild(option);
        });
      }

      const projetosLista = document.getElementById("projetos-lista");
      const btnAddProjeto = document.getElementById("btnAddProjeto");

      function criarProjetoInput(nome = "", link = "") {
        const div = document.createElement("div");
        div.classList.add("mb-2", "projeto-item");
        div.innerHTML = `
          <input type="text" class="form-control mb-1" placeholder="Nome do projeto" value="${nome}">
          <input type="url" class="form-control mb-1" placeholder="Link do projeto" value="${link}">
          <button type="button" class="btn btn-sm btn-danger">Remover</button>
          <hr>
        `;
        div
          .querySelector("button")
          .addEventListener("click", () => div.remove());
        projetosLista.appendChild(div);
      }

      try {
        const projetosSalvos = JSON.parse(user.profile?.projetos || "[]");
        projetosSalvos.forEach((p) => criarProjetoInput(p.nome, p.link));
      } catch {}

      btnAddProjeto.addEventListener("click", () => criarProjetoInput());

      try {
        const cursosSalvos = JSON.parse(
          user.profile?.cursos_concluidos || "[]"
        );
        cursosSalvos.forEach((c) =>
          criarCursoConcluido(c.curso, c.repositorio)
        );
      } catch {}
    }

    const formEl = document.getElementById("editarPerfilForm");
    formEl.addEventListener("submit", async function (e) {
      e.preventDefault();

      let avatarBase64 = avatarPreview.src;
      const file = avatarInput.files[0];
      if (file) {
        avatarBase64 = await toBase64(file);
      }

      const projetos = Array.from(
        document.querySelectorAll(".projeto-item")
      ).map((div) => {
        const [nomeInput, linkInput] = div.querySelectorAll("input");
        return { nome: nomeInput.value, link: linkInput.value };
      });

      const cursosConcluidos = Array.from(
        document.querySelectorAll(".curso-item")
      ).map((div) => {
        const nome = div.querySelector("strong").textContent;
        const link = div.querySelector("a").getAttribute("href");
        return { curso: nome, repositorio: link };
      });

      const payload = {
        name: document.getElementById("nome_publico").value,
        nome_completo:
          user.type_user_id === 2
            ? document.getElementById("nome_completo").value
            : null,
        contato: document.getElementById("contato").value,
        resumo: document.getElementById("resumo").value,
        avatar: avatarBase64,
        redes_sociais: (() => {
          const insta = document.getElementById("instagram").value.trim();
          return insta ? { instagram: insta } : {};
        })(),
        especializacao: prepararEspecializacaoParaEnvio(),
        data_nascimento:
          document.getElementById("data_nascimento")?.value || null,
        github_perfil: document.getElementById("github_perfil").value || null,
        projetos,
        estado: document.getElementById("estado").value,
        cidade: document.getElementById("cidade").value,
        cursos_concluidos:
          cursosConcluidos && Array.isArray(cursosConcluidos)
            ? cursosConcluidos
            : [],
      };

      const update = await fetch("http://localhost:3000/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await update.json();
      if (update.ok) {
        alert("Perfil atualizado com sucesso!");
        window.location.href = "perfil.html";
      } else {
        alert("Erro ao atualizar: " + result.message);
      }
    });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    alert("Erro ao carregar perfil. Tente novamente mais tarde.");
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
});
