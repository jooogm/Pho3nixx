const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const { User } = require("../models/Users"); // Modelo Sequelize
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const router = express.Router();

require("dotenv").config();
const SECRET = process.env.JWT_SECRET;
const SECRET_RESET = process.env.JWT_SECRET_RESET; // para recuperação de senha

// 🔁 ESQUECEU SENHA
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const token = jwt.sign({ id: user.id }, SECRET_RESET, { expiresIn: "15m" });

    const resetLink = `${process.env.FRONTEND_URL}/redefinirsenha.html?token=${token}`;

    await transporter.sendMail({
      from: '"Suporte" <seuemail@gmail.com>',
      to: user.email,
      subject: "Redefinição de Senha",
      text: `Olá, ${user.name}! Clique no link para redefinir sua senha: ${resetLink}`,
    });

    res.json({ message: "E-mail de redefinição enviado!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail", error });
  }
});

// 🔄 RESET SENHA
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_RESET);
    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    res.status(400).json({ message: "Token inválido ou expirado" });
  }
});

module.exports = router;
