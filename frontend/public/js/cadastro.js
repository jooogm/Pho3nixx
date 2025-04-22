document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cpf_cnpj = document.getElementById('cpf_cnpj').value;
    const password = document.getElementById('password').value;
    const type_user_id = document.getElementById('type_user_id').value;
    const mensagem = document.getElementById("mensagem");
  
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, cpf_cnpj, password, type_user_id })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        document.getElementById('mensagem').innerText = 'Cadastro realizado! Faça login.';
        window.location.href = '/views/login.html';
      } else {
        document.getElementById('mensagem').innerText = data.message;
      }
    } catch (error) {
      document.getElementById('mensagem').innerText = 'Erro ao conectar ao servidor.';
      console.error(error);
    }
  }); 
