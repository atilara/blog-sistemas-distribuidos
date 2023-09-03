const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const api = require('../service/api');
// Rotas criadas para lidar com artigos

// CREATE
// Rota para criação de um novo artigo
router.get('/admin/articles/new', adminAuth, (req, res) => {
  console.log('New Article');
  api.get('/admin/articles/new').then((response) => {
    res.render('admin/articles/new', { categories: response.data.categories });
  });
});

// READ
//Rota para listagem de todos os artigos
router.get('/admin/articles', adminAuth, (req, res) => {
  api.get('/admin/articles').then((response) => {
    res.render('admin/articles', { articles: response.data.articles });
  });
});

// // UPDATE
// // Rota para edição de artigo
router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
  var id = req.params.id;
  // Redireciona caso o id não seja um número
  if (isNaN(id)) res.redirect('/admin/articles');

  // find by primary key, ou seja, id
  api
    .get(`/admin/articles/edit/${id}`)
    .then((response) => {
      res.render('admin/articles/edit', {
        article: response.data.article,
        categories: response.data.categories,
      });
    })
    .catch((error) => {
      res.redirect('/admin/articles');
    });
});

// router.get('/articles/page/:number', (req, res) => {
//   var page = req.params.number;
//   var offset = 0;

//   if (isNaN(page) || page <= 1) {
//     offset = 0;
//   } else {
//     // Parse int pq vai receber String
//     offset = (parseInt(page) - 1) * 4;
//   }
//   // Encontra todos os artigos e tbm retorna a contagem de artigos
//   // Limit vai limitar a quantidade de artigos que serão retornados
//   // Offset mudará quais serão os 4 artigos retornados de acordo com o paramêtro na url
//   // Esse método retorna a count de items e as rows (items em si)
//   Article.findAndCountAll({
//     order: [['id', 'DESC']],
//     limit: 4,
//     offset: offset,
//   }).then((articles) => {
//     var next;
//     if (offset + 4 >= articles.count) {
//       next = false;
//     } else {
//       next = true;
//     }
//     var result = {
//       page: parseInt(page),
//       next: next,
//       articles: articles,
//     };
//     Category.findAll().then((categories) => {
//       res.render('admin/articles/page', {
//         result: result,
//         categories: categories,
//       });
//     });
//   });
// });

module.exports = router;
