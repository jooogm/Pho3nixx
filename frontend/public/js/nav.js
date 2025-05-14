document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.getElementById("auth-buttons");
    if (!authButtons) return;
  
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const typeUserId = payload.type_user_id;
  
        let extraButtons = "";
  
        if (typeUserId === 2) {
            // Profissional
            extraButtons += `<a href="candidaturas.html" class="btn btn-candidaturas me-2">Minhas Candidaturas</a>`;
          } else if (typeUserId === 3) {
            // Empresa
            extraButtons += `<a href="minhas_vagas.html" class="btn btn- me-2 btn-minhasvagas">Minhas Vagas</a>`;
          }
  
        authButtons.innerHTML = `
          ${extraButtons}
          <a href="perfil.html" class="btn btn-outline-primary me-2 btn-meuperfil">Meu Perfil</a>
          <a href="#" class="btn btn-secondary btn-sair" id="logout">Sair</a>
        `;
  
        document.getElementById("logout").addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          window.location.href = "index.html";
        });
      } catch (error) {
        console.error("Erro ao processar o token JWT:", error);
      }
    }
  });
  
    // Funcionalidade da barra de pesquisa
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
