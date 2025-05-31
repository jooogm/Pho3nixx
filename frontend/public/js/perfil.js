document.addEventListener("DOMContentLoaded", async function () {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado! Faça login.");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch(`${window.API_URL}/api/usuarios/perfil`, {
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

    const nomeExibido =
      user.type_user_id === 2
        ? `${user.name} ${user.profile?.nome_completo || ""}`
        : user.name;

    let avatar = user.profile?.avatar;
    let avatarSrc = "";

    if (!avatar) {
      avatarSrc =
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";
    } else if (
      typeof avatar === "string" &&
      (avatar.startsWith("data:image/") || avatar.startsWith("http"))
    ) {
      avatarSrc = avatar;
    } else {
      avatarSrc = `data:image/jpeg;base64,${avatar}`;
    }

    let perfilHTML = `
  <div class="text-center">
    <img src="${avatarSrc}" class="rounded-circle avatar-perfil">
    <h3>${nomeExibido}</h3>
    <p><strong>Email:</strong> ${user.email}</p>
    <hr>
  </div>
`;

    if (user.type_user_id === 2) {
      let redes = {};
      try {
        redes = JSON.parse(user.profile?.redes_sociais || "{}");
      } catch (e) {
        console.warn("Erro ao ler redes_sociais:", e);
      }

      perfilHTML += `
          <h4>Perfil Profissional</h4>
          <p><strong>Idade:</strong> <span id="idadeUsuario">Calculando...</span></p>
          <p><strong>Estado:</strong> <span id="estadoLabel">Carregando...</span></p>
          <p><strong>Cidade:</strong> ${user.profile?.cidade || "-"}</p>
          <p><strong>Contato:</strong> ${user.profile?.contato || "-"}</p>
          <p><strong>Especializações:</strong></p>
<div style="margin-bottom: 1rem;">
${
  user.profile?.especializacao
    ? user.profile.especializacao
        .split(",")
        .map(
          (e) =>
            `<span class="badge bg-warning text-dark me-1">${e.trim()}</span>`
        )
        .join("")
    : "<span>-</span>"
}
</div>
          <p><strong>Resumo:</strong> ${user.profile?.resumo || "-"}</p>
          <p><strong>Instagram:</strong> ${
            redes.instagram
              ? (() => {
                  const url = new URL(redes.instagram);
                  const usuario = url.pathname.replaceAll("/", "");
                  return `<a href="${redes.instagram}" target="_blank">@${usuario}</a>`;
                })()
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
<p><strong>Cursos Concluídos:</strong></p>
<ul style="list-style: none; padding-left: 0;">
${
  user.profile?.cursos_concluidos
    ? JSON.parse(user.profile.cursos_concluidos)
        .map(
          (c) =>
            `<li><strong>${c.curso}</strong>: <a href="${c.repositorio}" target="_blank">${c.repositorio}</a></li>`
        )
        .join("")
    : "<li>Nenhum curso concluído.</li>"
}
</ul>
        `;
    } else if (user.type_user_id === 3) {
      let redes = {};
      try {
        redes = JSON.parse(user.profile?.redes_sociais || "{}");
      } catch (e) {
        console.warn("Erro ao ler redes_sociais:", e);
      }

      perfilHTML += `
          <h4>Perfil Empresarial</h4>
          <p><strong>Estado:</strong> <span id="estadoLabel">Carregando...</span></p>
          <p><strong>Cidade:</strong> ${user.profile?.cidade || "-"}</p>
          <p><strong>Contato:</strong> ${user.profile?.contato || "-"}</p>
          <p><strong>Resumo:</strong> ${user.profile?.resumo || "-"}</p>
          <p><strong>Instagram:</strong> ${
            redes.instagram
              ? (() => {
                  const url = new URL(redes.instagram);
                  const usuario = url.pathname.replaceAll("/", "");
                  return `<a href="${redes.instagram}" target="_blank">@${usuario}</a>`;
                })()
              : "Não informado"
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
