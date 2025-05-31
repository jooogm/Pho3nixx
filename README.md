# Pho3nix - Plataforma de Conexão entre Candidatos e Empresas de TI

**Pho3nix** é uma plataforma desenvolvida como parte do **TCC** da **Faculdade USCS** – Universidade de São Caetano do Sul, no curso de **Análise e Desenvolvimento de Sistemas (ADS)**. O objetivo da plataforma é **conectar candidatos da área de TI** com empresas que buscam **profissionais especializados** em diversas tecnologias e ofecer trilhas de cursos recomendados que os ajudem a atender aos requisitos das vagas.

## Funcionalidades da Plataforma

- **Candidatos:**

  - 📄 Cadastro de candidatos com informações pessoais e profissionais.
  - 🔍 Visualização de vagas abertas e possibilidade de se candidatar diretamente.
  - 🎓 Visualização e inclusão de cursos recomendados com link para repositório no GitHub.

- **Empresas:**
  - 🏢 Cadastro de empresas e publicação de vagas de emprego.
  - 📋 Gerenciamento de candidatos que se candidataram às vagas publicadas.
  - 👤 Visualização de candidatos que se inscreveram em suas vagas.

## Tecnologias e Ferramentas Utilizadas

### Backend

- 🔧 **Node.js** com **Express**: API RESTful para gerenciamento das requisições e integração com o banco de dados.
- 🔐 **JWT (JSON Web Tokens)**: Sistema de autenticação seguro para garantir o acesso adequado de candidatos e empresas.

### Banco de Dados

- 🗃️ MySQL (AWS RDS): Banco relacional hospedado em nuvem com acesso restrito por grupo de segurança.

### Outras Tecnologias

- 🔄 **Sequelize**: ORM (Object-Relational Mapping) utilizado para facilitar a comunicação entre o backend e o banco de dados MySQL.

### Frontend

- 🎨 HTML + CSS
- 💡 Bootstrap 5.3: Framework utilizado para responsividade e componentes visuais.
- 🖼️ AOS.js: Biblioteca para animações de scroll.
- 🛂 Validações dinâmicas com JS para formulários e máscaras.

### Infraestrutura e Segurança

- ☁️ Amazon EC2: Instância Ubuntu configurada como servidor de produção.
- 🌐 NGINX: Servidor web utilizado para gerenciar requisições HTTP e proxy reverso (em produção).
- 🔒 HTTPS com SSL/TLS: Certificado configurado para garantir comunicação segura.
- 🔐 Criptografia de Senha (bcrypt): Todas as senhas dos usuários são criptografadas antes de serem armazenadas.
- 🔄 Backup e acesso restrito ao banco via regras de firewall (grupos de segurança no EC2 e RDS).
- 📧 Recuperação de Senha via E-mail: Implementação de sistema de redefinição com token JWT e envio por Nodemailer.

## Como Funciona

1. **Candidatos** podem se cadastrar, fazer login, visualizar vagas abertas e se candidatar diretamente às vagas de seu interesse. Buscar cursos recomendados para cada vaga e inserir no perfil
   a conclusão do curso.
2. **Empresas** podem se cadastrar, fazer login, publicar vagas e gerenciar candidatos que se candidataram às vagas.

## Objetivo do Projeto

O projeto foi desenvolvido com o objetivo de **facilitar a conexão entre profissionais de TI e empresas e auxiliar no crescimento do profissional** em um mercado de trabalho altamente competitivo. A plataforma tem como foco a **eficiência, segurança e usabilidade**, proporcionando uma experiência simples e intuitiva para todos os usuários.

## Links Importantes

- **Repositório GitHub:** [GitHub - Pho3nix](https://github.com/jooogm/Pho3nixx.git) 🔗
- **Link da Aplicação (em breve):** [Pho3nix](http://pho3nix.com.br/) 🌐

## Tecnologias e Metodologias Utilizadas

- 🛠️ Backend: Node.js, Express, Sequelize
- 🗃️ Banco de Dados: MySQL (RDS AWS)
- ☁️ Hospedagem: Amazon EC2 (Ubuntu Server)
- 🔐 Segurança: JWT, bcrypt, HTTPS, grupos de segurança
- 💻 Frontend: HTML, CSS, Bootstrap, AOS.js
- 🔄 Integração contínua: Git e GitHub
- ✉️ Nodemailer: Para recuperação de senha
- 📦 Multer: Para upload de imagens de perfil

---

Desenvolvido por alunos da USCS como parte do TCC de **Análise e Desenvolvimento de Sistemas** ().
