const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./Users'); // Importa o modelo User
const Vaga = require('./Vagas'); // Importa o modelo Vaga

const Inscricao = sequelize.define('Inscricao', {
  inscricao_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,    
    references: {
      model: 'users', // Nome da tabela no banco de dados
      key: 'id'
    }
  },
  vaga_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vagas', // Nome da tabela no banco de dados
      key: 'vaga_id'
    }
  },
  status_inscricao: {
    type: DataTypes.ENUM('em andamento', 'processo seletivo', 'encerrado', 'aprovado'),
    defaultValue: 'em andamento',
  },
  data_inscricao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'inscricoes', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});


module.exports = Inscricao;
