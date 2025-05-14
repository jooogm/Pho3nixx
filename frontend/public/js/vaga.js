document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const vagaId = params.get('id');
    const token = localStorage.getItem('token');
  
    if (!vagaId || !token) {
      alert('Vaga ou token não encontrado.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/vagas/${vagaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) throw new Error('Erro ao carregar detalhes da vaga.');
  
      const vaga = await response.json();
  
      document.getElementById('detalhes-vaga').innerHTML = `
        <h2>${vaga.titulo}</h2>
        <p><strong>Descrição:</strong> ${vaga.descricao}</p>
        <p><strong>Requisitos:</strong> ${vaga.requisitos}</p>
        <p><strong>Salário:</strong> R$ ${vaga.salario}</p>
        <p><strong>Status:</strong> ${vaga.status}</p>
      `;
  
      document.getElementById('btn-inscrever').addEventListener('click', async () => {
        try {
          const inscrever = await fetch(`http://localhost:3000/api/inscricoes/candidatar/${vagaId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ vagaId })
          });
  
          if (!inscrever.ok) {
            const erro = await inscrever.json();
            alert('Erro ao se inscrever: ' + erro.message);
            return;
          }
  
          alert('Inscrição realizada com sucesso!');
        } catch (erro) {
          console.error('Erro ao se inscrever:', erro);
        }
      });
  
    } catch (erro) {
      console.error('Erro ao carregar detalhes da vaga:', erro);
    }
  });
  