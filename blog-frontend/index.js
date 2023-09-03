const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const userController = require('./src/user/UsersController');
const articleController = require('./src/articles/ArticlesController');
const categoryController = require('./src/categories/CategoriesController');

const api = require('./src/service/api');

const ONE_HOUR = 1000 * 60 * 60;
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

// View Engine
app.set('view engine', 'ejs');
// Static
app.use(express.static('public'));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', userController);
app.use('/', articleController);
app.use('/', categoryController);

app.get('/', (req, res) => {
  // Ordenando de forma decrescente através do order
  // Request para localhost:5500 para receber os dados e renderizar na tela
  api.get('/').then((response) => {
    res.render('index', {
      articles: response.data.articles,
      categories: response.data.categories,
    });
  });
});

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  // Procura por um artigo onde o slug for o mesmo que foi passado na URL
  api.get(`/${slug}`).then((response) => {
    console.log('Article');
    console.log(response.data);
    res.render('article', {
      article: response.data.article,
      categories: response.data.categories,
    });
  });
});

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;
  api.get(`/category/${slug}`).then((response) => {
    res.render('index', {
      // Array de todos os artigos pertencentes aquela categoria, só é possível
      // graças ao include/join que foi feito anteriormente
      articles: response.data.category.articles,
      categories: response.data.categories,
    });
  });
});

app.listen('5501', () => {
  console.log('Server running');
});
