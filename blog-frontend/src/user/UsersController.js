const express = require('express');
const router = express.Router();
const api = require('../service/api');
// Package para criptografia

// CREATE
router.get('/admin/users/new', (req, res) => {
  res.render('admin/users/new');
});

// READ
router.get('/admin/users', (req, res) => {
  api.get('/admin/users').then((response) => {
    res.render('admin/users', { users: response.data.users });
  });
});

// LOGIN
router.get('/login', (req, res) => {
  res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  api
    .post('/authenticate', { email, password })
    .then((response) => {
      if (response.data.id) {
        // Criação de sessão
        req.session.user = {
          id: response.data.id,
          email: response.data.email,
        };
        res.redirect('/admin/articles');
      } else {
        res.redirect('/login');
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/login');
    });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/login');
});

module.exports = router;
