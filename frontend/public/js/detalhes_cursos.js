const CURSOS = {
  Algoritmos: {
    id: "Algoritmos",
    titulo: "Curso de Algoritmos - Curso em Vídeo",
    descricao:
      "Ideal para iniciantes, este curso ensina lógica de programação desde os fundamentos. Aprenda como funcionam algoritmos, estruturas de decisão, repetições e fluxogramas com explicações simples, práticas e didáticas. Se você está começando no mundo da programação, esta trilha é o ponto de partida perfeito. Aula do Curso de Algoritmo criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "Lógica de Programação",
      "Estruturas Condicionais",
      "Laços de Repetição",
      "Fluxogramas",
      "Variáveis e Constantes",
      "Algoritmos Sequenciais",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=9GzEg4RPK_SHFjm9&amp;list=PLHz_AreHm4dmSj0MHol_aoNYCSGFqvfXV",
    destaque: true,
  },
  Mysql: {
    id: "Mysql",
    titulo: "Curso de Banco de Dados com MySQL - Curso em Vídeo",
    descricao:
      "Aprenda a dominar o MySQL, um dos bancos de dados mais utilizados no mundo. Este curso cobre desde os conceitos básicos de modelagem de dados até comandos SQL avançados, criação de tabelas, relacionamentos e consultas otimizadas. Uma trilha essencial para quem quer trabalhar com backend ou administração de dados. Aula do Curso de Banco de Dados com MySQL criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "Modelagem de Dados",
      "Criação de Tabelas",
      "Consultas SQL",
      "Joins",
      "Chaves Primárias e Estrangeiras",
      "Funções Agregadas",
      "Normalização",
      "Relacionamentos entre Tabelas",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=tIZuBxk5X79ABdSi&amp;list=PLHz_AreHm4dkBs-795Dsgvau_ekxg8g1r",
    destaque: true,
  },
  Php: {
    id: "Php",
    titulo: "Curso PHP Iniciante - Curso em Vídeo",
    descricao:
      "Neste curso você aprenderá PHP do zero, com foco em desenvolvimento web moderno. O professor Guanabara ensina desde a sintaxe básica da linguagem até a criação de formulários, manipulação de dados e conexão com banco de dados. Ideal para quem quer criar sites dinâmicos e sistemas com backend próprio. Aula do Curso de PHP para Iniciantes criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "Sintaxe PHP",
      "Variáveis e Tipos de Dados",
      "Formulários HTML com PHP",
      "Validação de Dados",
      "Manipulação de Strings",
      "Integração com MySQL",
      "Programação Orientada a Objetos (POO)",
      "Estrutura de Projetos Web",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=ZCumS2d5sZ1woDLR&amp;list=PLHz_AreHm4dm4beCCCmW4xwpmLf6EHY9k",
    destaque: true,
  },
  Java: {
    id: "Java",
    titulo: "Curso de Java - Curso em Vídeo",
    descricao:
      "Curso completo de Java ministrado pelo professor Gustavo Guanabara. Aprenda os fundamentos da linguagem Java, incluindo sintaxe básica, orientação a objetos, estruturas de repetição, tratamento de erros e construção de aplicações. Ideal para quem está começando na programação ou quer reforçar a base com uma linguagem amplamente utilizada no mercado. Aula do Curso Java criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "Sintaxe básica da linguagem Java",
      "Tipos de dados e variáveis",
      "Operadores e estruturas de decisão",
      "Laços de repetição (while, for, do-while)",
      "Funções e modularização",
      "Programação Orientada a Objetos (POO)",
      "Criação de classes e objetos",
      "Herança, polimorfismo e encapsulamento",
      "Tratamento de erros com try/catch",
      "Compilação e execução de programas Java",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=wvShne5MfE0Hf3G-&amp;list=PLHz_AreHm4dkI2ZdjTwZA4mPMxWTfNSpR",
    destaque: true,
  },
  GitGithub: {
    id: "GitGithub",
    titulo: "Curso de Git e GitHub - Curso em Vídeo",
    descricao:
      "Aprenda a utilizar Git e GitHub para versionamento de código de forma prática e objetiva. Neste curso do professor Gustavo Guanabara, você vai entender desde os conceitos básicos de controle de versão até o uso prático de comandos Git, criação de repositórios, branches, merge, pull requests e muito mais. Um conteúdo essencial para qualquer desenvolvedor que deseja trabalhar em equipe e controlar o histórico de seus projetos.Aula do Curso Git e GitHub criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "Conceito de Controle de Versão",
      "Instalação e Configuração do Git",
      "Comandos básicos do Git (init, add, commit, status)",
      "Criação e clonagem de repositórios",
      "Uso do GitHub para hospedagem de código",
      "Trabalho com Branches e Merge",
      "Histórico e navegação de commits",
      "Push, Pull e Pull Request",
      "Colaboração em projetos via GitHub",
      "Resolução de conflitos de merge",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=PIa46pBnUoH17sgP&amp;list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA",
    destaque: true,
  },
  Python: {
    id: "Python",
    titulo: "Curso de Python - Aula 01: Seja um Programador",
    descricao:
      "Primeira aula do curso de Python do professor Gustavo Guanabara, ideal para quem está começando na programação. O conteúdo aborda o que é programação, o papel do programador e por que aprender Python, destacando sua simplicidade e versatilidade. Uma introdução motivadora e acessível para todos os públicos. Aula do Curso - Python - criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "O que é programação",
      "Função do programador no mercado",
      "História e evolução do Python",
      "Por que aprender Python",
      "Primeiros passos no pensamento lógico",
      "Configuração do ambiente de desenvolvimento",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=FW-AYzuf4mViQnqb&amp;list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6",
    destaque: true,
  },
  HTML5: {
    id: "HTML5",
    titulo: "Curso de HTML5 - Curso em Vídeo",
    descricao:
      "Aprenda HTML5 com o professor Gustavo Guanabara neste curso completo e gratuito. Descubra como estruturar páginas da web com semântica, acessibilidade e boas práticas, criando sites modernos do zero. Aula do Curso - HTML 5 - criado pelo professor Gustavo Guanabara para o portal CursoemVideo.com.",
    competencias: [
      "Criação e estruturação de páginas HTML",
      "Uso de tags semânticas",
      "Organização de conteúdo com listas, tabelas e formulários",
      "Links e navegação entre páginas",
      "Boas práticas de acessibilidade e semântica",
      "Incorporação de mídias (vídeos, áudios, imagens)",
      "Validação e comentários em HTML",
      "Criação de layouts com HTML básico",
    ],
    video:
      "https://www.youtube.com/embed/videoseries?si=CAdWpsMDYp7BH0Sd&amp;list=PLHz_AreHm4dlAnJ_jJtV29RFxnPHDuk9o",
    destaque: true,
  },
};

window.CURSOS = CURSOS;
