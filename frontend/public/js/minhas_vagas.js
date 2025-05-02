document.addEventListener('DOMContentLoaded', () => {
    const vagasContainer = document.getElementById('vagas-container');
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Você precisa estar logado.');
      window.location.href = 'login.html';
      return;
    }
  
    fetch('http://localhost:3000/api/vagas/minhas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar vagas');
        return res.json();
      })
      .then(vagas => {
        if (vagas.length === 0) {
          vagasContainer.innerHTML = '<p>Nenhuma vaga cadastrada.</p>';
          return;
        }
  
        vagas.forEach(vaga => {
          const vagaCard = document.createElement('div');
          vagaCard.classList.add('vaga-card');
  
          vagaCard.innerHTML = `
            <h3>${vaga.titulo}</h3>
            <p><strong>Descrição:</strong> ${vaga.descricao}</p>
            <p><strong>Localização:</strong> ${vaga.localizacao}</p>
            <p><strong>Salário:</strong> R$ ${vaga.salario}</p>
            <p><strong>Tipo de contrato:</strong> ${vaga.tipo_contrato}</p>
            <p><strong>Status:</strong> ${vaga.status}</p>
            <p><strong>Data de criação:</strong> ${new Date(vaga.created_at).toLocaleDateString()}</p>
          `;
  
          vagasContainer.appendChild(vagaCard);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar vagas:', error);
        vagasContainer.innerHTML = '<p>Erro ao carregar vagas.</p>';
      });
  });
  