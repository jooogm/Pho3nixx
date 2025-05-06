document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get("id");

  console.log("ID da vaga:", vagaId);


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
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const vaga = await response.json();

    if (!response.ok) {
      mensagem.textContent = vaga.message || "❌ Erro ao carregar vaga.";
      return;
    }

    // Preenche os campos do formulário com os dados da vaga
    for (const key in vaga) {
      if (form.elements[key]) {
        form.elements[key].value = vaga[key];
      }
    }

  } catch (err) {
    console.error(err);
    mensagem.textContent = "❌ Erro ao buscar vaga.";
  }

  // Submissão da edição
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    try {
      const updateResponse = await fetch(`http://localhost:3000/api/vagas/${vagaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const updateResult = await updateResponse.json();

      if (updateResponse.ok) {
        mensagem.textContent = "✅ Vaga atualizada com sucesso!";
      } else {
        mensagem.textContent = updateResult.message || "❌ Erro ao atualizar vaga.";
      }

    } catch (error) {
      console.error(error);
      mensagem.textContent = "❌ Erro na requisição.";
    }
  });
});
