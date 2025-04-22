document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensagem = document.getElementById("mensagem");
  
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token); // Salva o token
        document.getElementById('mensagem').innerText = 'Login realizado!';
        mensagem.style.color = "green";
        mensagem.textContent = "✅ Login realizado com sucesso!";
        console.log("Token recebido:", data.token);

        // Redirecionar para página inicial do sistema
        window.location.href = 'index.html';
      } else {
        document.getElementById('mensagem').innerText = data.message;
        mensagem.style.color = "red";
      mensagem.textContent = data.message || "❌ Erro ao realizar login.";
      }
    } catch (error) {
      document.getElementById('mensagem').innerText = 'Erro ao conectar ao servidor.';
      console.error(error);
      mensagem.style.color = "red";
      mensagem.textContent = "Erro ao conectar com o servidor.";
      console.error("Erro:", error);
    }
  });