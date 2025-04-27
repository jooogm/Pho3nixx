document.addEventListener("DOMContentLoaded", async function () {
    const avatarInput = document.getElementById("avatar");
    const avatarPreview = document.getElementById("avatarPreview");

    avatarInput.addEventListener("change", function () {
        const file = avatarInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                avatarPreview.src = e.target.result; // Atualiza a prévia
            };
            reader.readAsDataURL(file);
        }
    });

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Usuário não autenticado! Faça login.");
            window.location.href = "/login.html";
            return;
        }

        const updateResponse = await fetch("http://localhost:3000/api/usuarios/perfil", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        
        });

        const data = await updateResponse.json();
        if (!updateResponse.ok) {
            alert("Erro ao carregar perfil: " + data.message);
            return;
        }

        const user = data.user;
        document.getElementById("nome_completo").value = user.profile?.nome_completo || '';
        document.getElementById("localizacao").value = user.profile?.localizacao || '';
        document.getElementById("contato").value = user.profile?.contato || '';
        document.getElementById("resumo").value = user.profile?.resumo || '';           
        document.getElementById("redes_sociais").value = user.profile?.redes_sociais || '';
        

// Atualiza a pré-visualização da imagem
avatarPreview.src = user.profile?.avatar 
  ? user.profile.avatar.startsWith("data:image/")
      ? user.profile.avatar
      : `data:image/jpeg;base64,${user.profile.avatar}`
  : "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";



        // Adicionar campos específicos para Profissionais e Empresas
        const extraCampos = document.getElementById("extraCampos");
        if (user.type_user_id === 2) { // Profissional
            extraCampos.innerHTML = `
                <div class="mb-3">
                    <label for="especializacao" class="form-label">Especialização</label>
                    <input type="text" class="form-control" id="especializacao" value="${user.profile?.especializacao || ''}">
                </div>
                <div class="mb-3">
                    <label for="data_nascimento" class="form-label">Data de Nascimento</label>
                    <input type="date" class="form-control" id="data_nascimento" value="${user.profile?.data_nascimento || ''}">
                </div>
                <div class="mb-3">
                    <label for="link_curriculo" class="form-label">Link do Currículo</label>
                    <input type="url" class="form-control" id="link_curriculo" value="${user.profile?.link_curriculo || ''}">
                </div>
            `;
        } else if (user.type_user_id === 3) { // Empresa
            extraCampos.innerHTML = `
                <div class="mb-3">
                    <label for="nome_empresa" class="form-label">Nome da Empresa</label>
                    <input type="text" class="form-control" id="nome_empresa" value="${user.profile?.nome_completo || ''}">
                </div>
            `;
        }




        // Manipulação do Formulário para Envio
        document.getElementById("editarPerfilForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const file = avatarInput.files[0];
            let avatarBase64 = avatarPreview.src; // Mantém a foto antiga se nada for selecionado 

    if (file) {
        avatarBase64 = await toBase64(file);
    }

            const dadosAtualizados = {
                nome_completo: document.getElementById("nome_completo").value,
                localizacao: document.getElementById("localizacao").value,
                contato: document.getElementById("contato").value,
                resumo: document.getElementById("resumo").value,
                avatar: avatarBase64,
                redes_sociais: document.getElementById("redes_sociais").value,
                especializacao: document.getElementById("especializacao")?.value || null,
                data_nascimento: document.getElementById("data_nascimento")?.value || null,
                link_curriculo: document.getElementById("link_curriculo")?.value || null,
            };

            const updateResponse = await fetch("http://localhost:3000/api/usuarios/perfil", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({nome_completo: document.getElementById("nome_completo").value,
                localizacao: document.getElementById("localizacao").value,
                contato: document.getElementById("contato").value,
                resumo: document.getElementById("resumo").value,
                avatar: avatarBase64,
                redes_sociais: document.getElementById("redes_sociais").value,
                especializacao: document.getElementById("especializacao")?.value || null,
                data_nascimento: document.getElementById("data_nascimento")?.value || null,
                link_curriculo: document.getElementById("link_curriculo")?.value || null,
            })
            });

            const updateData = await updateResponse.json();
            if (updateResponse.ok) {
                alert("Perfil atualizado com sucesso!");
                window.location.href = "perfil.html";
            } else {
                alert("Erro ao atualizar perfil: " + updateData.message);
            }
        });

        // Função utilitária para converter File em base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // gera base64 com prefixo data:image/...
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Erro ao carregar perfil. Tente novamente mais tarde.");
    }
});
