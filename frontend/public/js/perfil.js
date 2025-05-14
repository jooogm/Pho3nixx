document.addEventListener("DOMContentLoaded", async function () {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Usuário não autenticado! Faça login.");
        window.location.href = "login.html";
        return;
      }
  
      const response = await fetch("http://localhost:3000/api/usuarios/perfil", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert("Erro ao carregar perfil: " + data.message);
        return;
      }
  
      const user = data.user;
      const perfilContainer = document.getElementById("perfilContainer");
  

// Exibe nome da empresa ou nome completo do profissional
const nomeExibido = user.type_user_id === 2
      ? `${user.name} ${user.profile?.nome_completo || ""}`
      : user.name;

      let avatar = user.profile?.avatar;
let avatarSrc = "";

// Se avatar está vazio ou nulo
if (!avatar) {
  avatarSrc = "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";

// Se avatar começa com "data:image/" ou "http" → usa direto
} else if (typeof avatar === "string" && (avatar.startsWith("data:image/") || avatar.startsWith("http"))) {
  avatarSrc = avatar;

// Caso contrário, assume que é base64 puro e adiciona o prefixo
} else {
  avatarSrc = `data:image/jpeg;base64,${avatar}`;
}

let perfilHTML = `
  <div class="text-center">
    <img src="${avatarSrc}" class="rounded-circle" width="150">
    <h3>${nomeExibido}</h3>
    <p><strong>Email:</strong> ${user.email}</p>
    <hr>
  </div>
`;
  
      if (user.type_user_id === 2) {
        perfilHTML += `
          <h4>Perfil Profissional</h4>
          <p><strong>Data de Nascimento:</strong> ${user.profile?.data_nascimento || '-'}</p>
          <p><strong>Localização:</strong> ${user.profile?.localizacao || '-'}</p>
          <p><strong>Contato:</strong> ${user.profile?.contato || '-'}</p>
          <p><strong>Especialização:</strong> ${user.profile?.especializacao || '-'}</p>
          <p><strong>Resumo:</strong> ${user.profile?.resumo || '-'}</p>
          <p><strong>Redes Sociais:</strong> ${user.profile?.redes_sociais || '-'}</p>
          <p><strong>Currículo:</strong> <a href="${user.profile?.link_curriculo || '#'}" target="_blank">Ver Currículo</a></p>
        `;
      } else if (user.type_user_id === 3) {
        perfilHTML += `
          <h4>Perfil Empresarial</h4>
          <p><strong>Localização:</strong> ${user.profile?.localizacao || '-'}</p>
          <p><strong>Contato:</strong> ${user.profile?.contato || '-'}</p>
          <p><strong>Resumo:</strong> ${user.profile?.resumo || '-'}</p>
          <p><strong>Redes Sociais:</strong> ${user.profile?.redes_sociais || '-'}</p>
        `;
      } else {
        perfilHTML += `<p>Tipo de usuário inválido.</p>`;
      }
  
      perfilContainer.innerHTML = perfilHTML;
  
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      alert("Erro ao carregar perfil. Tente novamente mais tarde.");
    }
  });
  