const express = require('express');
const app = express();
var cors = require('cors')

const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');
// Carregando as rotas para o arquivo principal
const categoriesController = require('./src/categories/CategoriesController');
const articlesController = require('./src/articles/ArticlesController');
const userController = require('./src/user/UsersController');
// Importando os models para criação das tabelas
const Article = require('./src/articles/Article');
const Category = require('./src/categories/Category');
const User = require('./src/user/User');

const ONE_HOUR = 1000 * 60 * 60;

// CORS
app.use(cors())
  

// Sessions para login
app.use(
  session({
    // Palavra aleatória para aumentar segurança das sessões
    secret: 'alskdjalsdkjalskdj',
    // Cookie de identificação, informa para o servidor que o usuário possui uma sessão
    cookie: {
      maxAge: ONE_HOUR,
    },
  }),
);

// Conexão com banco de dados
connection
  .authenticate()
  .then(() => {
    console.log('Conexão realizada');
  })
  .catch((error) => {
    console.log(error);
  });

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Utilizando as rotas existentes nos controllers utilizando um prefixo
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', userController);

app.get('/', (req, res) => {
  // Ordenando de forma decrescente através do order
  Article.findAll({ order: [['id', 'DESC']] }).then((articles) => {
    Category.findAll().then((categories) => {
      res.json({ articles: articles, categories: categories });
    });
  });
});

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  // Procura por um artigo onde o slug for o mesmo que foi passado na URL
  Article.findOne({ where: { slug: slug } })
    .then((article) => {
      console.log('article');
      console.log(article);
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.json({ article: article, categories: categories });
        });
      } else {
        res.json('Artigo não encontrado');
      }
    })
    .catch((error) => {
      res.json(error);
    });
});

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: { slug: slug },
    // Vai trazer pra gente todos os artigos que estão dentro dessa categoria
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        // Para preencher o menu das categorias
        Category.findAll().then((categories) => {
          res.json({ category: category, categories: categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((error) => {
      res.json(error);
    });
});

app.listen('5500', () => {
  console.log('Server running');
});
