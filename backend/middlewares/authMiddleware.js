const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // Verifica se o token foi fornecido
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // O token deve estar no formato: Bearer <token>
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const jwtToken = tokenParts[1];

  try {
    // Verifica a validade do token
    const decoded = jwt.verify(jwtToken, SECRET);

   // Verificar os dados do token
    // console.log('Decoded JWT:', decoded);

    // Adiciona os dados do usuário decodificados à requisição (ex: id e type_user_id)
    req.user = decoded;
    // Continuar para a próxima rota
    next();
} catch (err) {
    console.error('Erro ao verificar token:', err.message);
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;