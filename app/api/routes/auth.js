var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
var jwt = require('jsonwebtoken');
var auth = require('../utils/auth');
var config = require('../config/config');

router.post('/signup/token', function(req, res, next) {
  const form = {
    name: req.body.name,
    password: auth.hashPass(req.body.password),
    email: req.body.email,
    icon: req.body.icon,
    background: req.body.background
  };
  db.sequelize.sync().then(() => {
    db.User.create(form).then(usr => {
      const payload = {
        id: usr.id,
        name: usr.name,
        email: usr.email
      }
      const token = jwt.sign(payload,config.development.secret, {
        expiresIn: '24h'
      });
      var data = {
        success: true,
        message: '認証に成功しました。',
        token: token
      }
      res.json({data});
    }).catch(err => {
      var data = {
        success: false,
        err: err,
        message: 'ユーザーが見つかりませんでした。',
      }
      res.json({data});
    })
  })
});

router.post('/login/token', function(req, res, next) {
  console.log(req.body);
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then(usr => {
    if (usr != null) {
      if (auth.verifyPass(req.body.password, usr.password)) {
        const payload = {
          id: usr.id,
          name: usr.name,
          email: usr.email
        }
        const token = jwt.sign(payload,config.development.secret, {
          expiresIn: '24h'
        });
        var data = {
          success: true,
          message: '認証に成功しました。',
          token: token
        }
      } else {
        var data = {
          success: false,
          message: 'パスワードが無効です。'
        }
      }
      res.json({data});
    } else {
      var data = {
        success: false,
        message: 'ユーザーが見つかりませんでした。',
      }
      res.json({data});
    }
  })
});

module.exports = router;
