const express = require('express');
// Definindo um router para conseguir estabelecer rotas fora
// do arquivo principal do projeto
const router = express.Router();
// Importa lib para transformar títulos em slug
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');
const api = require('../service/api');

// CREATE
// Criação de novas categorias
router.get('/admin/categories/new', adminAuth, (req, res) => {
  res.render('admin/categories/new');
});

// READ
// Lista de Categorias
router.get('/admin/categories', adminAuth, (req, res) => {
  api.get('/admin/categories').then((response) => {
    console.log('response', response.data);

    res.render('admin/categories', {
      categories: response.data.categories,
    });
  });
});

// UPDATE
// Edita as categorias
router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
  var id = req.params.id;
  // Redireciona caso o id não seja um número
  api.get(`/admin/categories/edit/${id}`).then((response) => {
    res.render('admin/categories/edit', {
      category: response.data.category,
    });
  });
});

// DELETE
// Deleta as categorias
router.post('/categories/delete', adminAuth, (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    // Verifica se o id é numérico
    if (!isNaN(id)) {
      // Método para excluir categoria, chamando método destroy e passando JSON
      Category.destroy({
        where: { id: id },
      }).then(() => {
        res.redirect('/admin/categories');
      });
    } else {
      res.redirect('/admin/categories');
    }
  } else {
    res.redirect('/admin/categories');
  }
});

module.exports = router;
