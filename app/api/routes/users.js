var express = require('express');
var router = express.Router();
// const db = require('../models/index');
// const { Op } = require('sequelize');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   const nm = req.query.name;
//   db.User.findAll().then(users => {
//     var data = {
//       title: 'Users/index',
//       content: users
//     }
//     res.render('users/index', data);
//   });
// });

// router.get('/add', function(req, res, next) {
//   var data = {
//     title: 'Users/Add',
//     form: new db.User(),
//     err: null
//   }
//   res.render('users/add', data);
// });

// router.post('/add', function(req, res, next) {
//   const form = {
//     name: req.body.name,
//     pass: req.body.password,
//     mail: req.body.mail,
//     age: req.body.age,
//   };
//   db.sequelize.sync().then(() => {
//     db.User.create(form).then(usr => {
//       res.redirect('/users');
//     }).catch(err => {
//       var data = {
//         title: 'Users/Add',
//         form: form,
//         err: err
//       }
//       res.render('users/add', data);
//     })
//   })
// });

// router.get('/edit', function(req, res, next) {
//   db.User.findByPk(req.query.id).then(usr => {
//     var data = {
//       title: 'Users/Edit',
//       form: usr
//     }
//     res.render('users/edit', data);
//   });
// });

// router.post('/edit', function(req, res, next) {
//   db.sequelize.sync().then(() => {
//     db.User.update({
//       name: req.body.name,
//       password: req.body.password,
//       mail: req.body.mail,
//       age: req.body.age,
//     },
//     {
//       where:{id:req.body.id}
//     }).then(usr => {
//       res.redirect('/users');
//     });
//   })
// });

// router.get('/delete', function(req, res, next) {
//   db.User.findByPk(req.query.id).then(usr => {
//     var data = {
//       title: 'Users/Delete',
//       form: usr
//     }
//     res.render('users/delete', data);
//   });
// });

// router.post('/delete', function(req, res, next) {
//   db.sequelize.sync().then(() => {
//     db.User.destroy({
//       where:{id:req.body.id}
//     }).then(usr => {
//       res.redirect('/users');
//     });
//   })
// });

// router.get('/login', function(req, res, next) {
//   var data = {
//     title: 'Users/Login',
//     content: '名前とパスワードを入力ください。'
//   }
//   res.render('users/login', data);
// });

// router.post('/login', function(req, res, next) {
//   db.User.findOne({
//     where: {
//       name: req.body.name,
//       pass:req.body.password
//     }
//   }).then(usr => {
//     if (usr != null) {
//       req.session.login = usr;
//       let back = req.session.back;
//       if (back == null) {
//         back = '/';
//       }
//       res.redirect(back);
//     } else {
//       var data = {
//         title: 'Users/Login',
//         content: '名前かパスワードに問題があります。再度入力してください。'
//       }
//       res.render('users/login', data);
//     }
//   })
// });

module.exports = router;
