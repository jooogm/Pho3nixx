document.addEventListener("DOMContentLoaded", async () => {
  const navbarContainer = document.getElementById("navbar-container");

  if (!navbarContainer) return;

  try {
    // Carrega o HTML da navbar
    const res = await fetch("/nav.html");
    const html = await res.text();
    navbarContainer.innerHTML = html;

    // Só roda a lógica dos botões depois que o HTML foi inserido
    configurarAutenticacaoNavbar();

    // Inicializa a barra de pesquisa após o carregamento do HTML
    inicializarBarraPesquisa();
  } catch (error) {
    console.error("Erro ao carregar navbar:", error);
  }

  const path = window.location.pathname;
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && path.includes(href)) {
      link.classList.add("active-link");
    }
  });
});

// Botões de autenticação
function inicializarBotoesAutenticacao() {
  const authButtons = document.getElementById("auth-buttons");
  if (!authButtons) return;

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const typeUserId = payload.type_user_id;

      let extraButtons = "";

      if (typeUserId === 2) {
        // Profissional
        extraButtons += `<a href="candidaturas.html" class="btn btn-nav me-2">Minhas Candidaturas</a>`;
      } else if (typeUserId === 3) {
        // Empresa
        extraButtons += `<a href="minhas_vagas.html" class="btn btn-nav me-2">Minhas Vagas</a>`;
      }

      authButtons.innerHTML = `
      ${extraButtons}
      <a href="perfil.html" class="btn btn-nav me-2">Meu Perfil</a>
      <a href="#" class="btn btn-nav" id="btnLogout">Sair</a>
    `;

      document.getElementById("btnLogout").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    } catch (error) {
      console.error("Erro ao processar o token JWT:", error);
    }
  }
}

function configurarAutenticacaoNavbar() {
  // Botões de autenticação
  const authButtons = document.getElementById("auth-buttons");
  if (!authButtons) return;

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const typeUserId = payload.type_user_id;

      let extraButtons = "";

      if (typeUserId === 2) {
        // Profissional
        extraButtons += `<a href="candidaturas.html" class="btn btn-nav me-2">Minhas Candidaturas</a>`;
      } else if (typeUserId === 3) {
        // Empresa
        extraButtons += `<a href="minhas_vagas.html" class="btn btn-nav me-2">Minhas Vagas</a>`;
      }

      authButtons.innerHTML = `
        ${extraButtons}
        <a href="perfil.html" class="btn btn-nav me-2">Meu Perfil</a>
        <a href="#" class="btn btn-nav" id="btnLogout">Sair</a>
      `;

      document.getElementById("btnLogout").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    } catch (error) {
      console.error("Erro ao processar o token JWT:", error);
    }
  }
}

// Funcionalidade da barra de pesquisa
function inicializarBarraPesquisa() {
  const formPesquisa = document.getElementById("form-pesquisa");
  const inputPesquisa = document.getElementById("input-pesquisa");

  if (formPesquisa) {
    formPesquisa.addEventListener("submit", (e) => {
      e.preventDefault();
      const termo = inputPesquisa.value.trim();
      if (termo) {
        // Redireciona para a página de resultados de busca com o termo como query string
        window.location.href = `busca.html?termo=${encodeURIComponent(termo)}`;
      }
    });
  }
}
