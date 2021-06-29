var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
var auth = require('../utils/auth');

router.get('/', auth.verifyToken, function(req, res, next) {
  db.User.findAll().then(users => {
    var data = {
      content: users
    }
    res.json({ message: data.content, payload: req.decoded });
  })  
});

// router.get('/login', function(req, res, next) {
//   var data = {
//     title: 'Users/Login',
//     content: '名前とパスワードを入力ください。'
//   }
//   res.render('users/login', data);
// });

module.exports = router;
