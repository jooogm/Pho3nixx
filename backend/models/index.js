// Importando os modelos
const sequelize = require('../config/database');
const Inscricao = require('./Inscricao');
const Vaga = require('./Vagas');
const {
  TypeUser,
  User,
  UserProfissionalProfile,
  UserEmpresaProfile
} = require('./Users');


// Definindo as associações entre os modelos
Inscricao.belongsTo(Vaga, { foreignKey: 'vaga_id', as: 'vaga' });
Inscricao.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Vaga.hasMany(Inscricao, { foreignKey: 'vaga_id', as: 'inscricoes' });
User.hasMany(Inscricao, { foreignKey: 'user_id' });

// Associações entre User e UserProfissionalProfile/UserEmpresaProfile
User.belongsTo(TypeUser, { foreignKey: 'type_user_id', as: 'typeUser' });  // Relacionando User com TypeUser
User.hasOne(UserProfissionalProfile, { foreignKey: 'user_id', as: 'profile' });  // Relacionando User com UserProfissionalProfile
User.hasOne(UserEmpresaProfile, { foreignKey: 'user_id', as: 'empresaProfile' });  // Relacionando User com UserEmpresaProfile

UserProfissionalProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });  // Relacionando UserProfissionalProfile com User
UserEmpresaProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });  // Relacionando UserEmpresaProfile com User





// Exportando todos os modelos para facilitar as importações em outras partes do código
module.exports = {
  Inscricao,
  TypeUser,
  Vaga,
  User,
  UserProfissionalProfile,
  UserEmpresaProfile,
  sequelize
};