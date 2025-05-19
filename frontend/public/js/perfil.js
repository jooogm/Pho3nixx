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
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Erro ao carregar perfil: " + data.message);
      return;
    }

    const user = data.user;
    const perfilContainer = document.getElementById("perfilContainer");

    // Exibe nome da empresa ou nome completo do profissional
    const nomeExibido =
      user.type_user_id === 2
        ? `${user.name} ${user.profile?.nome_completo || ""}`
        : user.name;

    let avatar = user.profile?.avatar;
    let avatarSrc = "";

    // Se avatar está vazio ou nulo
    if (!avatar) {
      avatarSrc =
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";

      // Se avatar começa com "data:image/" ou "http" → usa direto
    } else if (
      typeof avatar === "string" &&
      (avatar.startsWith("data:image/") || avatar.startsWith("http"))
    ) {
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
          <p><strong>Idade:</strong> <span id="idadeUsuario">Calculando...</span></p>
          <p><strong>Estado:</strong> <span id="estadoLabel">Carregando...</span></p>
          <p><strong>Cidade:</strong> ${user.profile?.cidade || "-"}</p>
          <p><strong>Contato:</strong> ${user.profile?.contato || "-"}</p>
          <p><strong>Especialização:</strong> ${
            user.profile?.especializacao || "-"
          }</p>
          <p><strong>Resumo:</strong> ${user.profile?.resumo || "-"}</p>
          <p><strong>LinkedIn:</strong> ${
            user.profile?.redes_sociais
              ? `<a href="${user.profile.redes_sociais}" target="_blank">${user.profile.redes_sociais}</a>`
              : "Não informado"
          }</p>
                 <p><strong>GitHub:</strong> ${
                   user.profile?.github_perfil
                     ? `<a href="${user.profile.github_perfil}" target="_blank">${user.profile.github_perfil}</a>`
                     : "Não informado"
                 }</p>
                 <p><strong>Projetos:</strong></p>
<ul style="list-style: none; padding-left: 0;">
${
  user.profile?.projetos
    ? JSON.parse(user.profile.projetos)
        .map(
          (p) =>
            `<li><strong>${p.nome}</strong>: <a href="${p.link}" target="_blank">${p.link}</a></li>`
        )
        .join("")
    : "<li>Nenhum projeto cadastrado.</li>"
}
</ul>   
        `;
    } else if (user.type_user_id === 3) {
      perfilHTML += `
          <h4>Perfil Empresarial</h4>
          <p><strong>Estado:</strong> <span id="estadoLabel">Carregando...</span></p>
          <p><strong>Cidade:</strong> ${user.profile?.cidade || "-"}</p>
          <p><strong>Contato:</strong> ${user.profile?.contato || "-"}</p>
          <p><strong>Resumo:</strong> ${user.profile?.resumo || "-"}</p>
          <p><strong>Linkedin:</strong> ${
            user.profile?.redes_sociais || "-"
          }</p>
        `;
    } else {
      perfilHTML += `<p>Tipo de usuário inválido.</p>`;
    }

    perfilContainer.innerHTML = perfilHTML;

    async function mostrarNomeEstadoPorId(id) {
      try {
        const response = await fetch("Estados.json");
        const estados = await response.json();
        const estadoEncontrado = estados.find(
          (e) => e.ID === id || e.ID.toString() === id.toString()
        );
        document.getElementById("estadoLabel").textContent = estadoEncontrado
          ? `${estadoEncontrado.Nome} (${estadoEncontrado.Sigla})`
          : "Desconhecido";
      } catch {
        document.getElementById("estadoLabel").textContent = "-";
      }
    }

    function calcularIdade(dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade;
    }

    if (user.profile?.estado) {
      await mostrarNomeEstadoPorId(user.profile.estado);
    }

    if (user.profile?.data_nascimento) {
      const idade = calcularIdade(user.profile.data_nascimento);
      document.getElementById("idadeUsuario").textContent = idade + " anos";
    }
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    alert("Erro ao carregar perfil. Tente novamente mais tarde.");
  }
});
