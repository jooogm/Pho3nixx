document.getElementById('form-vaga').addEventListener('submit', async function(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado.');
        return;
    }

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    try {
        const response = await fetch('http://localhost:3000/api/vagas/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('mensagem').innerText = "Vaga criada com sucesso!";
            this.reset();
        } else {
            document.getElementById('mensagem').innerText = result.message || "Erro ao criar vaga.";
        }
    } catch (error) {
        console.error("Erro ao enviar vaga:", error);
        document.getElementById('mensagem').innerText = "Erro de conexão.";
    }
});
