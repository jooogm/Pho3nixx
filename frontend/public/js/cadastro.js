document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const cpf_cnpj = document.getElementById("cpf_cnpj").value;
    const password = document.getElementById("password").value;
    const type_user_id = document.getElementById("type_user_id").value;
    const mensagem = document.getElementById("mensagem");

    try {
      const response = await fetch(`${window.API_URL}/api/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, cpf_cnpj, password, type_user_id }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("mensagem").innerText =
          "Cadastro realizado! Faça login.";
        window.location.href = "login.html";
      } else {
        document.getElementById("mensagem").innerText = data.message;
      }
    } catch (error) {
      document.getElementById("mensagem").innerText =
        "Erro ao conectar ao servidor.";
      console.error(error);
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const cpfCnpjInput = document.getElementById("cpf_cnpj");

  const maskOptions = {
    mask: [
      {
        mask: "000.000.000-00", // CPF
        regex: "^\\d{0,11}$",
        lazy: false,
      },
      {
        mask: "00.000.000/0000-00", // CNPJ
        regex: "^\\d{12,14}$",
        lazy: false,
      },
    ],
    dispatch: function (appended, dynamicMasked) {
      const number = (dynamicMasked.value + appended).replace(/\D/g, "");
      return dynamicMasked.compiledMasks.find((m) =>
        number.match(new RegExp(m.regex))
      );
    },
  };

  IMask(cpfCnpjInput, maskOptions);
});
