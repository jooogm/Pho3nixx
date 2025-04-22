const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Supondo que você tenha o Sequelize configurado corretamente aqui

// Modelo do TypeUser
const TypeUser = sequelize.define('TypeUser', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

// Modelo do Usuário
const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf_cnpj: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type_user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'TypeUsers',  // Nome da tabela no banco de dados
      key: 'id'
    }
  },
  logo: Sequelize.STRING,
}, {
  tableName: 'Users', 
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
});

// Modelo Perfil Profissional
const UserProfissionalProfile = sequelize.define('UserProfissionalProfile', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_completo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data_nascimento: Sequelize.DATE,
  localizacao: Sequelize.STRING,
  contato: Sequelize.STRING,
  especializacao: Sequelize.STRING,
  resumo: Sequelize.TEXT,
  avatar: Sequelize.STRING,
  redes_sociais: Sequelize.JSON,
  link_curriculo: Sequelize.STRING,
}, {
  tableName: 'user_profissional_profile',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
});

// Modelo Perfil Empresa
const UserEmpresaProfile = sequelize.define('UserEmpresaProfile', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_completo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  localizacao: Sequelize.STRING,
  contato: Sequelize.STRING,
  resumo: Sequelize.TEXT,
  avatar: Sequelize.STRING,
  redes_sociais: Sequelize.JSON,
}, {
  tableName: 'user_empresa_profile',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
});

// Exportando os modelos
module.exports = {
  TypeUser,
  User,
  UserProfissionalProfile,
  UserEmpresaProfile,
  sequelize
};