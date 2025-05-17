document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  if (!userId) {
    document.body.innerHTML = "<p>ID do candidato não informado.</p>";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/usuarios/profissional/${userId}`
    );
    if (!res.ok) throw new Error("Erro ao buscar candidato.");

    const data = await res.json();
    const user = data.user;

    const nomeCompleto = user.profile?.nome_completo || "";
    document.getElementById(
      "nome"
    ).textContent = `${user.name} ${nomeCompleto}`;
    document.getElementById("email").textContent = user.email;
    document.getElementById("localizacao").textContent =
      user.profile?.localizacao || "Não informado";
    document.getElementById("contato").textContent =
      user.profile?.contato || "Não informado";
    document.getElementById("especializacao").textContent =
      user.profile?.especializacao || "Não informado";
    document.getElementById("resumo").textContent =
      user.profile?.resumo || "Não informado";
    document.getElementById("curriculo").href =
      user.profile?.link_curriculo || "#";
    document.getElementById("curriculo").textContent = user.profile
      ?.link_curriculo
      ? "Ver Currículo"
      : "Nenhum currículo disponível";

    document.getElementById("avatar").src =
      user.profile?.avatar && user.profile.avatar.startsWith("data:image/")
        ? user.profile.avatar
        : user.profile?.avatar
        ? `data:image/jpeg;base64,${user.profile.avatar}`
        : "https://www.gravatar.com/avatar/placeholder?s=120";
  } catch (err) {
    console.error("Erro:", err);
    document.body.innerHTML = "<p>Erro ao carregar perfil do candidato.</p>";
  }
});
