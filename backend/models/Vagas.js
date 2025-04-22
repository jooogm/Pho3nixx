const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Inscricao = require('./Inscricao');

// Definição do modelo Vaga
const Vaga = sequelize.define('Vaga', {
  vaga_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: DataTypes.STRING,
  descricao: DataTypes.TEXT,
  empresa_id: DataTypes.INTEGER,
  empresa_nome: DataTypes.STRING,
  localizacao: DataTypes.STRING,
  salario: DataTypes.DECIMAL(10, 2),
  tipo_contrato: DataTypes.ENUM('CLT', 'PJ', 'Freelancer', 'Estágio'),
  nivel_experiencia: DataTypes.ENUM('Júnior', 'Pleno', 'Sênior'),
  status: {
    type: DataTypes.ENUM('Aberta', 'Fechada'),
    defaultValue: 'Aberta'
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE
}, {
  tableName: 'vagas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true, // ✅ habilita o soft delete
});

module.exports = Vaga;