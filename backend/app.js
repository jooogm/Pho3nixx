const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const path = require("path");
const { sequelize } = require("./models");

require("dotenv").config();

const app = express(); // Definir o app antes de usá-lo

// Rotas
const userRoutes = require("./routes/userRoutes");
const vagaRoutes = require("./routes/vagasRoutes");
const inscricaoRoutes = require("./routes/inscricaoRoutes");
const authRoutes = require("./routes/auth");

// Middleware global
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Configuração do CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://pho3nix.com.br"], // Substitua pelo endereço do frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

// Limitar o tamanho do corpo da requisição
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Pasta onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Limitar o tamanho do arquivo para 10MB
});

// Usar o middleware no endpoint de upload
app.post("/upload", upload.single("avatar"), (req, res) => {
  res.send("Arquivo enviado com sucesso!");
});

// Servir arquivos estáticos
app.use(
  express.static(path.join(__dirname, "..", "frontend", "public", "views"))
);
//app.use(express.static(path.join(__dirname, "..", "frontend", "src", "public", "css")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public", "js")));

// Definir rotas para usuários, vagas, inscrições e autenticação
app.use("/api/auth", authRoutes); // Rota de autenticação (login, registro)
app.use("/api/usuarios", userRoutes); // Rotas de usuários (criação, edição, etc.)
app.use("/api/vagas", vagaRoutes); // Rotas de vagas (listar, criar vagas, etc.)
app.use("/api/inscricoes", inscricaoRoutes); // Rotas de inscrições (inscrever, listar inscrições, etc.)

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "frontend", "public", "views", "index.html")
  ); // Caminho para o arquivo HTML
});

// Inicializando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}`);

  // Conexão com o banco de dados
  sequelize
    .authenticate()
    .then(() => console.log("Conectado ao banco de dados"))
    .catch((error) => console.log("Erro ao conectar ao banco de dados", error));
});

module.exports = app;
