document.getElementById('formEsqueciSenha').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem');
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        mensagem.textContent = "✅ E-mail de redefinição enviado com sucesso!";
        mensagem.style.color = "green";
      } else {
        mensagem.textContent = "❌ " + (data.message || "Erro ao enviar e-mail.");
        mensagem.style.color = "red";
      }
    } catch (error) {
      console.error(error);
      mensagem.textContent = "❌ Erro ao conectar com o servidor.";
      mensagem.style.color = "red";
    }
  });