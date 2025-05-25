const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const { Inscricao, Vaga } = require("../models");
const { User, UserProfissionalProfile } = require("../models/Users");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

// Função para candidatar-se a uma vaga
const candidatarVaga = async (req, res) => {
  try {
    const vaga_id = Number(req.params.vagaId); // ID da vaga a qual o usuário está se candidatando
    const userId = req.user.id; // ID do usuário (usando o ID decodificado do token)

    if (req.user.type_user_id !== 2) {
      // Ajuste o valor de '2' conforme o seu modelo (por exemplo, 2 para profissional)
      return res
        .status(403)
        .json({ message: "Empresas não podem se candidatar a vagas." });
    }

    if (!vaga_id) {
      return res.status(400).json({ message: "ID da vaga é obrigatório." });
    }

    // Verifica se a vaga existe e se não foi excluída
    const vaga = await Vaga.findByPk(vaga_id, { paranoid: false });
    if (!vaga || vaga.deleted_at !== null) {
      return res
        .status(404)
        .json({ message: "Vaga não encontrada ou foi excluída." });
    }

    // Verifica se o usuário já está inscrito na vaga, incluindo soft deleted
    const existingInscricao = await Inscricao.findOne({
      where: {
        user_id: userId,
        vaga_id: vaga_id,
      },
      paranoid: false, // Inclui registros soft deleted na busca
    });

    if (existingInscricao) {
      // Se a inscrição foi "excluída" (deleted_at não é null), reativa a inscrição
      if (existingInscricao.deleted_at !== null) {
        // Reativa a inscrição (removendo o soft delete e atualizando o status)
        await existingInscricao.restore();
        existingInscricao.status_inscricao = "em andamento";
        existingInscricao.updated_at = new Date();
        await existingInscricao.save();
        return res.status(200).json({
          message: "Você foi reativado na candidatura para esta vaga.",
        });
      }

      // Caso contrário, o candidato já está inscrito e não pode se inscrever novamente
      return res
        .status(400)
        .json({ message: "Você já está inscrito nesta vaga." });
    }

    // Se a inscrição não existe, cria uma nova inscrição
    const inscricao = await Inscricao.create({
      user_id: userId,
      vaga_id: vaga_id,
      status_inscricao: "em andamento", // Status inicial da inscrição
      data_inscricao: new Date(), // Data de inscrição
      created_at: new Date(), // Data de criação
      updated_at: new Date(), // Data de atualização
    });

    return res
      .status(201)
      .json({ message: "Candidatura realizada com sucesso!", inscricao });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao se candidatar à vaga." });
  }
};

// Função para acompanhar as candidaturas de um usuário
const acompanharCandidatura = async (req, res) => {
  try {
    const userId = req.user.id; // O userId já está disponível após o middleware de autenticação
    const userType = req.user.type_user_id;

    if (userType !== 2) {
      return res
        .status(403)
        .json({ message: "Apenas profissionais podem ver suas candidaturas." });
    }
    console.log(`Buscando inscrições para o usuário ID: ${userId}`);
    //console.log("📍 ENTROU NA ROTA /acompanhamento");

    const candidaturas = await Inscricao.findAll({
      where: { user_id: userId, deleted_at: null }, // Garantir que apenas candidaturas ativas sejam retornadas
      include: [
        {
          model: Vaga,
          as: "vaga",
          attributes: ["titulo", "descricao"],
          required: false,
        },
      ],
    });
    console.log(`Inscrições encontradas: ${JSON.stringify(candidaturas)}`);

    if (candidaturas.length === 0) {
      return res.status(200).json({
        message: "Você ainda não se inscreveu em nenhuma vaga ativa.",
      });
    }

    return res.status(200).json(candidaturas);
  } catch (error) {
    console.error("Erro ao acompanhar candidaturas:", error);
    return res
      .status(500)
      .json({ message: "Erro ao acompanhar candidaturas." });
  }
  console.log("📍 ENTROU NA ROTA /acompanhamento");
};

// Função para obter inscrições ativas de um usuário
const obterInscricoes = async (req, res) => {
  try {
    const userId = req.user.id; // O ID do usuário é extraído do token
    const inscricoes = await Inscricao.findAll({
      where: {
        user_id: userId,
        deleted_at: null, // Apenas inscrições não canceladas
      },
      include: [
        {
          model: Vaga,
          as: "vaga",
          attributes: ["titulo", "descricao"], // Campos específicos da vaga
        },
      ],
    });

    if (inscricoes.length === 0) {
      return res.status(200).json({
        message: "Você ainda não se inscreveu em nenhuma vaga ativa.",
      });
    }

    return res.status(200).json(inscricoes);
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return res.status(500).json({ message: "Erro ao buscar inscrições." });
  }
};

// Função para cancelar a inscrição
const cancelarInscricao = async (req, res) => {
  try {
    const { inscricaoId } = req.params; // ID da inscrição a ser cancelada
    const userId = req.user.id; // ID do usuário (profissional autenticado)

    // Verifique se a inscrição pertence ao usuário (profissional)
    const inscricao = await Inscricao.findOne({
      where: {
        inscricao_id: inscricaoId,
        user_id: userId,
        deleted_at: null, // Verifique que a inscrição ainda não foi cancelada
      },
    });

    if (!inscricao) {
      return res
        .status(404)
        .json({ message: "Inscrição não encontrada ou já cancelada." });
    }

    // Atualizando a inscrição com soft delete
    const currentDate = new Date();

    // Atualizar o campo deleted_at para a data atual
    await Inscricao.update(
      { deleted_at: currentDate },
      {
        where: { inscricao_id: inscricaoId },
      }
    );

    res.status(200).json({ message: "Inscrição cancelada com sucesso." });
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error.message);
    res.status(500).json({ message: "Erro ao cancelar inscrição." });
  }
};

// Função para obter candidatos de uma vaga
const obterCandidatos = async (req, res) => {
  try {
    const vagaId = req.params.vagaId;
    const status = req.query.status || ""; // Filtro de status

    const candidatos = await Inscricao.findAll({
      where: {
        vaga_id: vagaId,
        status_inscricao: {
          [Op.like]: `%${status}%`, // Filtro baseado no status
        },
        deleted_at: null, // Apenas inscrições ativas
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "id"],
          include: {
            model: UserProfissionalProfile,
            as: "profile", // isso só funciona se o alias estiver correto no model
            attributes: [
              "nome_completo",
              "contato",
              "especializacao",
              "avatar",
            ],
          },
        },
      ],
    });

    if (candidatos.length === 0) {
      return res
        .status(200)
        .json({ message: "Não há candidatos para esta vaga." });
    }

    // console.log("Candidatos encontrados:", JSON.stringify(candidatos, null, 2));

    return res.status(200).json(candidatos);
  } catch (error) {
    console.error("Erro ao obter candidatos:", error);
    return res.status(500).json({ message: "Erro ao obter candidatos." });
  }
};

// Função para alterar o status de uma inscrição
const alterarStatus = async (req, res) => {
  try {
    const { inscricaoId } = req.params;
    const { novoStatus } = req.body;

    // Valida o status
    const statusValido = [
      "em andamento",
      "processo seletivo",
      "aprovado",
      "encerrado",
    ];
    if (!statusValido.includes(novoStatus)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const inscricao = await Inscricao.findByPk(inscricaoId);

    if (!inscricao) {
      return res.status(404).json({ message: "Inscrição não encontrada." });
    }

    // Atualiza o status
    inscricao.status_inscricao = novoStatus;
    await inscricao.save();

    return res
      .status(200)
      .json({ message: "Status da inscrição alterado com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar status:", error);
    return res
      .status(500)
      .json({ message: "Erro ao alterar status da inscrição." });
  }
};

// Função para obter o perfil do candidato
const obterPerfilCandidato = async (req, res) => {
  const userId = req.params.id;

  try {
    // Buscando o usuário e o perfil profissional com base no userId
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: UserProfissionalProfile,
        as: "profile", // Alias conforme a associação definida no modelo
        attributes: [
          "nome_completo",
          "resumo",
          "estado",
          "cidade", // Adicione "cidade" aqui
          "contato",
          "especializacao",
          "avatar",
          "redes_sociais",
          "github_perfil",
          "projetos",
          "cursos_concluidos",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Candidato não encontrado" });
    }

    // Retorna os dados do candidato e o perfil profissional
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Erro ao obter perfil do candidato:", error);
    return res.status(500).json({ message: "Erro ao carregar o perfil" });
  }
};

const obterInscricaoComPerfil = async (req, res) => {
  try {
    const { inscricaoId } = req.params;

    const inscricao = await Inscricao.findOne({
      where: { inscricao_id: inscricaoId },
      attributes: ["inscricao_id", "status_inscricao", "vaga_id", "user_id"],
      include: {
        model: User,
        as: "user",
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
            "projetos",
            "cursos_concluidos",
          ],
        },
      },
    });

    if (!inscricao) {
      return res.status(404).json({ message: "Inscrição não encontrada." });
    }

    return res.status(200).json(inscricao);
  } catch (error) {
    console.error("Erro ao buscar inscrição com perfil:", error);
    return res.status(500).json({ message: "Erro ao buscar inscrição." });
  }
};

module.exports = {
  candidatarVaga,
  acompanharCandidatura,
  obterInscricoes,
  cancelarInscricao,
  obterCandidatos,
  alterarStatus,
  obterPerfilCandidato,
  obterInscricaoComPerfil,
};
