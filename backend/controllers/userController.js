const {
  User,
  TypeUser,
  UserProfissionalProfile,
  UserEmpresaProfile,
} = require("../models/Users");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

// Lógica de Criar Usuario
const createUser = async (req, res) => {
  const { name, email, password, cpf_cnpj, type_user_id } = req.body;

  try {
    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !password || !cpf_cnpj || !type_user_id) {
      console.log("Erro: Campos obrigatórios faltando.");
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }
    console.log("Campos obrigatórios verificados com sucesso.");

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha criptografada com sucesso.");

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      cpf_cnpj,
      type_user_id,
    });
    console.log(`Usuário criado com sucesso: ${user.name} (ID: ${user.id})`);

    // Resposta bem-sucedida
    res.status(201).json({ message: "Usuário criado com sucesso!" });
    console.log("Resposta enviada: Usuário criado com sucesso.");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    // Verificando erro de chave estrangeira
    if (error.name === "SequelizeForeignKeyConstraintError") {
      console.log("Erro de chave estrangeira: user_id não encontrado.");
      return res.status(400).json({
        message: "Erro de chave estrangeira, user_id não encontrado.",
      });
    }

    // Caso seja um erro de validação do Sequelize
    if (error instanceof Sequelize.ValidationError) {
      console.log("Erro de validação detectado.");
      return res
        .status(400)
        .json({ message: "Erro de validação", details: error.errors });
    }

    // Para erros gerais
    console.log("Erro geral no processo de criação do usuário.");
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: error.message });
  }
};

// Lógica para login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o email existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("Erro: Usuário não encontrado.");
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    console.log(`Usuário encontrado: ${user.name} (ID: ${user.id})`);

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Erro: Senha incorreta.");
      return res.status(400).json({ message: "Senha incorreta." });
    }
    console.log("Senha verificada com sucesso.");

    // Gerar o token JWT com a chave secreta do ambiente
    const token = jwt.sign(
      { id: user.id, type_user_id: user.type_user_id },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    console.log("Token JWT gerado com sucesso.");

    // Verificar o perfil do usuário
    let userProfile = null;
    if (user.type_user_id === 2) {
      // Profissional
      userProfile = await UserProfissionalProfile.findOne({
        where: { user_id: user.id },
      });
      console.log("Perfil de profissional carregado com sucesso.");
    } else if (user.type_user_id === 3) {
      // Empresa
      userProfile = await UserEmpresaProfile.findOne({
        where: { user_id: user.id },
      });
      console.log("Perfil de empresa carregado com sucesso.");
    }

    // Responder com os dados do usuário e o token
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type_user_id: user.type_user_id,
        profile: userProfile,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error); // Mostra no terminal

    res.status(500).json({
      message: "Erro ao fazer login",
      error: error.message,
      full: error, // Adiciona esse campo pra te ajudar no Postman
    });
  }
};

// Função para carregar o perfil do usuário
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // A chave 'userId' é decodificada do token
    const typeUserId = req.user.type_user_id; // A chave 'type_user_id' é decodificada do token

    //console.log('User Profile Data:', req.user);

    // Buscar o usuário com o id do token e carregar o perfil
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: UserProfissionalProfile,
          as: "profile",
          required: false, // Um usuário pode não ter um perfil profissional
          attributes: [
            "id",
            "nome_completo",
            "data_nascimento",
            "estado",
            "cidade",
            "contato",
            "especializacao",
            "resumo",
            "avatar",
            "redes_sociais",
            "github_perfil",
            "projetos",
            "cursos_concluidos",
          ],
        },
        {
          model: UserEmpresaProfile,
          as: "empresaProfile",
          required: false, // Um usuário pode não ter um perfil de empresa
          attributes: [
            "id",
            "nome_completo",
            "estado",
            "cidade",
            "contato",
            "resumo",
            "avatar",
            "redes_sociais",
          ],
        },
      ],
    });

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Verificar qual perfil o usuário tem (profissional ou de empresa) e montar a resposta
    //const userProfile = user.type_user_id === 2 ? user.UserProfissionalProfile : user.UserEmpresaProfile;

    let userProfile = null;
    if (typeUserId === 2) {
      // Profissional
      userProfile = user.profile;
    } else if (typeUserId === 3) {
      // Empresa
      userProfile = user.empresaProfile;
    } else {
      return res.status(400).json({ message: "Tipo de usuário inválido." });
    }

    // Retornar os dados do usuário com o perfil
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type_user_id: typeUserId,
        profile: userProfile, // Perfil do usuário (Profissional ou Empresa)
      },
    });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    return res.status(500).json({ message: "Erro ao carregar o perfil." });
  }
};

// Lógica para editar perfil do usuário
const editUserProfile = async (req, res) => {
  const {
    nome_completo,
    resumo,
    estado,
    cidade,
    contato,
    redes_sociais,
    avatar,
    data_nascimento,
    especializacao,
    github_perfil,
    projetos,
    cursos_concluidos,
  } = req.body;

  try {
    const userId = req.user.id;
    const typeUserId = req.user.type_user_id; // A chave 'userId' é decodificada do token

    // Buscar o usuário com o id do token
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Verificar qual perfil o usuário tem e atualizar
    if (typeUserId === 2) {
      // Profissional
      const userProfissionalProfile = await UserProfissionalProfile.findOne({
        where: { user_id: user.id },
      });
      if (userProfissionalProfile) {
        // Atualizar perfil profissional
        await userProfissionalProfile.update({
          nome_completo,
          resumo,
          estado,
          cidade,
          contato,
          redes_sociais:
            typeof redes_sociais === "string"
              ? redes_sociais
              : JSON.stringify(redes_sociais),
          avatar,
          data_nascimento:
            data_nascimento || userProfissionalProfile.data_nascimento, // Verifica se data de nascimento foi enviada
          especializacao:
            especializacao || userProfissionalProfile.especializacao, // Verifica se especialização foi enviada
          github_perfil: github_perfil || userProfissionalProfile.github_perfil, // Verifica se github_perfil foi enviada
          projetos:
            typeof projetos === "string" ? projetos : JSON.stringify(projetos),
          cursos_concluidos:
            typeof cursos_concluidos === "string"
              ? cursos_concluidos
              : JSON.stringify(cursos_concluidos),
        });
        return res
          .status(200)
          .json({ message: "Perfil profissional atualizado com sucesso!" });
      } else {
        return res
          .status(404)
          .json({ message: "Perfil profissional não encontrado." });
      }
    } else if (typeUserId === 3) {
      // Empresa
      const userEmpresaProfile = await UserEmpresaProfile.findOne({
        where: { user_id: user.id },
      });
      if (userEmpresaProfile) {
        // Atualizar perfil de empresa
        await userEmpresaProfile.update({
          resumo,
          estado,
          cidade,
          contato,
          redes_sociais:
            typeof redes_sociais === "string"
              ? redes_sociais
              : JSON.stringify(redes_sociais),
          avatar,
        });
        return res
          .status(200)
          .json({ message: "Perfil de empresa atualizado com sucesso!" });
      } else {
        return res
          .status(404)
          .json({ message: "Perfil de empresa não encontrado." });
      }
    } else {
      return res.status(400).json({ message: "Tipo de usuário inválido." });
    }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
};

// Lógica para exclusão lógica de usuário
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { id, deleted_at: null } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    await user.update({ deleted_at: new Date() });
    await user.save();

    res.status(200).json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir usuário", error: error.message });
  }
};

// Pegar o perfil público da empresa
const getEmpresaPublica = async (req, res) => {
  const empresaProfileId = req.params.id;

  try {
    const empresa = await UserEmpresaProfile.findOne({
      where: { id: empresaProfileId },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    });

    if (!empresa) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }
    return res.status(200).json({
      user: {
        id: empresa.user.id,
        name: empresa.user.name,
        email: empresa.user.email,
        profile: {
          id: empresa.id,
          nome_completo: empresa.nome_completo,
          estado: empresa.estado,
          cidade: empresa.cidade,
          contato: empresa.contato,
          resumo: empresa.resumo,
          avatar: empresa.avatar,
          redes_sociais: empresa.redes_sociais,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar empresa pelo ID de perfil:", error);
    return res.status(500).json({ message: "Erro ao buscar empresa." });
  }
};

// Pegar o perfil público do profissional
const getProfissionalPublico = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "name", "email"],
      include: {
        model: UserProfissionalProfile,
        as: "profile",
        attributes: [
          "nome_completo",
          "estado",
          "cidade",
          "contato",
          "especializacao",
          "resumo",
          "avatar",
          "redes_sociais",
          "github_perfil",
        ],
      },
    });

    if (!user || !user.profile) {
      return res
        .status(404)
        .json({ message: "Usuário profissional não encontrado." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Erro ao buscar perfil público do profissional:", error);
    res.status(500).json({ message: "Erro ao buscar perfil do profissional." });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  editUserProfile,
  getEmpresaPublica,
  getProfissionalPublico,
  deleteUser,
};
