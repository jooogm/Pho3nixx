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
  
      let perfilHTML = `
        <div class="text-center">
          <img src="${user.profile?.avatar 
            ? user.profile.avatar.startsWith('data:image/') || user.profile.avatar.startsWith("https")
              ? user.profile.avatar 
              : `data:image/jpeg;base64,${user.profile.avatar}`
            : 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250'}"
            class="rounded-circle" width="150">
          <h3>${user.name}</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <hr>
        </div>
      `;
  
      if (user.type_user_id === 2) {
        perfilHTML += `
          <h4>Perfil Profissional</h4>
          <p><strong>Nome Completo:</strong> ${user.profile?.nome_completo || '-'}</p>
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
          <p><strong>Nome da Empresa:</strong> ${user.profile?.nome_completo || '-'}</p>
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
  