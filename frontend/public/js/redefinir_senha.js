document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const form = document.querySelector("form");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (!token) {
    alert("Token de redefinição não encontrado na URL.");
    form.querySelector("button").disabled = true;
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!newPassword || !confirmPassword) {
      alert("Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Senha redefinida com sucesso! Faça login novamente.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Erro ao redefinir senha.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao redefinir senha. Tente novamente.");
    }
  });
});