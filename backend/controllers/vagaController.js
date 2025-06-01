const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Vaga = require("../models/Vagas");
const { UserEmpresaProfile } = require("../models/Users");
const { Op } = require("sequelize");
const { User } = require("../models/Users");

// Criação de uma nova vaga
const criarVaga = async (req, res) => {
  const {
    titulo,
    descricao,
    estado,
    cidade,
    salario,
    tipo_contrato,
    nivel_experiencia,
    requisitos,
    beneficios,
    data_validade,
    modalidade,
    cursos_indicados,
  } = req.body;

  try {
    console.log("Iniciando processo de criação de vaga...");

    // Verificação do token JWT
    const userId = req.user.id;
    const typeUserId = req.user.type_user_id;

    // Verifica se é uma empresa (type_user_id === 3)
    if (typeUserId !== 3) {
      return res
        .status(403)
        .json({ message: "Apenas empresas podem criar vagas." });
    }

    // Busca o perfil da empresa do usuário
    const empresaProfile = await UserEmpresaProfile.findOne({
      where: { user_id: userId },
      include: {
        model: User,
        as: "user",
        attributes: ["name"], // só o campo que você quer
      },
    });

    if (!empresaProfile) {
      console.log("Perfil de empresa não encontrado para o usuário:", userId);
      return res
        .status(404)
        .json({ message: "Perfil de empresa não encontrado." });
    }

    console.log("Perfil de empresa encontrado:", empresaProfile.name);

    // Criação da nova vaga com dados do perfil da empresa
    const novaVaga = await Vaga.create({
      titulo,
      descricao,
      estado,
      cidade,
      salario,
      tipo_contrato,
      nivel_experiencia,
      requisitos,
      modalidade,
      cursos_indicados,
      beneficios,
      empresa_id: userId,
      empresa_nome: empresaProfile.user.name, // Nome da empresa
    });

    if (!empresaProfile.user || !empresaProfile.user.name) {
      console.log("Nome da empresa não encontrado.");
      return res
        .status(400)
        .json({ message: "Nome da empresa não encontrado." });
    }

    console.log("Vaga criada com sucesso:", novaVaga);
    res.status(201).json(novaVaga);
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    res.status(500).json({ message: "Erro ao criar vaga." });
  }
};

// Listar vagas com filtro opcional por título, localização e área
const listarVagas = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      localizacao,
      salario,
      salario_min,
      salario_max,
      tipo_contrato,
      nivel_experiencia,
    } = req.query;

    const where = {};
    if (titulo) where.titulo = { [Op.like]: `%${titulo}%` };
    if (localizacao) where.localizacao = { [Op.like]: `%${localizacao}%` };
    if (descricao) where.descricao = { [Op.like]: `%${descricao}%` };
    if (salario) where.salario = salario; // valor exato, ou usar >=
    if (tipo_contrato)
      where.tipo_contrato = { [Op.like]: `%${tipo_contrato}%` };
    if (nivel_experiencia)
      where.nivel_experiencia = { [Op.like]: `%${nivel_experiencia}%` };

    // Faixa de salário
    if (salario_min && salario_max) {
      where.salario = {
        [Op.between]: [parseFloat(salario_min), parseFloat(salario_max)],
      };
    } else if (salario_min) {
      where.salario = { [Op.gte]: parseFloat(salario_min) };
    } else if (salario_max) {
      where.salario = { [Op.lte]: parseFloat(salario_max) };
    }

    const vagas = await Vaga.findAll({ where });
    res.status(200).json(vagas);
  } catch (error) {
    console.error("Erro ao listar vagas:", error);
    res.status(500).json({ message: "Erro ao listar vagas." });
  }
};

// Atualizar dados de uma vaga existente
const atualizarVaga = async (req, res) => {
  try {
    const vagaId = req.params.id;

    const [affectedRows] = await Vaga.update(req.body, {
      where: { vaga_id: vagaId },
    });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Vaga não encontrada." });
    }

    res.status(200).json({ message: "Vaga atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar vaga:", error);
    res.status(500).json({ message: "Erro ao atualizar vaga." });
  }
};

// Excluir uma vaga
const excluirVaga = async (req, res) => {
  try {
    const vagaId = req.params.id;

    const affectedRows = await Vaga.destroy({ where: { vaga_id: vagaId } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Vaga não encontrada." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir vaga:", error);
    res.status(500).json({ message: "Erro ao excluir vaga." });
  }
};

// Restaurar uma vaga excluída
const restaurarVaga = async (req, res) => {
  try {
    const vagaId = req.params.id;

    const affectedRows = await Vaga.restore({ where: { vaga_id: vagaId } });
    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Vaga não encontrada ou não foi excluída anteriormente.",
      });
    }

    res.status(200).json({ message: "Vaga restaurada com sucesso." });
  } catch (error) {
    console.error("Erro ao restaurar vaga:", error);
    res.status(500).json({ message: "Erro ao restaurar vaga." });
  }
};

// Listar vagas de uma empresa específica
const listarMinhasVagas = async (req, res) => {
  const userId = req.user.id;

  try {
    const empresaProfile = await UserEmpresaProfile.findOne({
      where: { user_id: userId },
    });

    if (!empresaProfile) {
      return res
        .status(404)
        .json({ message: "Perfil de empresa não encontrado." });
    }

    const vagas = await Vaga.findAll({ where });

    res.status(200).json(vagas);
  } catch (error) {
    console.error("Erro ao buscar vagas da empresa:", error);
    res.status(500).json({ message: "Erro ao buscar suas vagas." });
  }
};

// Buscar uma vaga específica pelo ID
const buscarVagaPorId = async (req, res) => {
  try {
    const vagaId = req.params.id;

    const vaga = await Vaga.findOne({ where: { vaga_id: vagaId } });
    if (!vaga) {
      return res.status(404).json({ message: "Vaga não encontradaa." });
    }

    res.status(200).json(vaga);
  } catch (error) {
    console.error("Erro ao buscar vaga:", error);
    res.status(500).json({ message: "Erro ao buscar vaga." });
  }
};

// Análise de perfis compatíveis para uma vaga específica
const getVagaAnalise = async (req, res) => {
  const vagaId = req.params.vagaId;

  try {
    const vaga = await Vaga.findByPk(vagaId);
    if (!vaga) {
      return res.status(404).json({ message: "Vaga não encontrada." });
    }

    const perfisCompatíveis = await UserProfissionalProfile.findAll({
      where: {
        // Especifique a lógica para encontrar perfis compatíveis com a vaga
        // Exemplo: 'nivel_experiencia': vaga.nivel_experiencia, etc.
      },
    });

    res.status(200).json({ vaga, perfisCompatíveis });
  } catch (error) {
    console.error("Erro ao buscar análise da vaga:", error);
    res.status(500).json({ message: "Erro ao buscar análise da vaga." });
  }
};

const listarVagasAbertas = async (req, res) => {
  const { titulo, empresa_id } = req.query;
  const where = { status: "Aberta" };

  // console.log("📍 Entrou na rota listarVagasAbertas", req.query);

  if (empresa_id) {
    where.empresa_id = empresa_id;
  } else if (titulo) {
    where.titulo = { [Op.like]: `%${titulo}%` };
  }

  try {
    const vagas = await Vaga.findAll({
      where,
      include: [
        {
          model: User,
          as: "empresa", // ⚠️ Alias deve estar igual ao definido no model
          attributes: ["id", "name"],
        },
      ],
    });
    res.status(200).json(vagas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar vagas." });
  }
};

// Exportação das funções para uso em outros módulos
module.exports = {
  criarVaga,
  listarVagas,
  atualizarVaga,
  excluirVaga,
  restaurarVaga,
  buscarVagaPorId,
  getVagaAnalise,
  listarVagasAbertas,
  listarMinhasVagas,
};
