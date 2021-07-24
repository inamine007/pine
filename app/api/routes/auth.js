var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
var jwt = require('jsonwebtoken');
var auth = require('../utils/auth');
var config = require('../config/config');

router.post('/signup', function(req, res, next) {
  const form = {
    name: req.body.name,
    password: auth.hashPass(req.body.password),
    email: req.body.email
  };
  db.sequelize.sync().then(() => {
    db.User.create(form).then(usr => {
      res.status(200).send();
    }).catch(err => {
      res.status(500).send({
        err
      });
    })
  })
});

router.post('/login', function(req, res, next) {
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
        const token = jwt.sign(payload,process.env.JWT_ACCESS_SECRET, {
          expiresIn: process.env.JWT_ACCESS_TIME
        });
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET, {
          expiresIn: process.env.JWT_REFRESH_TIME
        });
        db.sequelize.sync().then(() => {
          db.Token.create({token: refreshToken}).then(items =>{
            res.status(200).send({
              token: token,
              refreshToken: refreshToken
            });
          }).catch(err => {
            res.json({err});
          })
        });
      } else {
        var data = {
          success: false,
          message: 'パスワードが無効です。'
        }
        res.json({data});
      }
    } else {
      var data = {
        success: false,
        message: 'ユーザーが見つかりませんでした。',
      }
      res.json({data});
    }
  })
});

router.post('/token', function(req, res, next) {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)

  db.Token.findOne({
    where: {
      token: refreshToken
    }
  }).then(token => {
    if (!token) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const payload = {
        id: user.id, 
        name: user.name, 
        email: user.email
      }
      const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TIME
      });
      res.json({ token: accessToken });
    });
  }).catch(err => {
    res.json({err});
  })
});

router.delete('/logout', (req, res) => {
  db.sequelize.sync().then(() => {
    db.Token.destroy({
      where: {
        token: req.body.token
      }
    }).then(token => {
      console.log(token);
      if (token != 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(500);
      }
    }).catch(err => {
      res.json({err});
    });
  });
})

module.exports = router;
