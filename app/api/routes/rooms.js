var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
var auth = require('../utils/auth');
var util = require('../utils/util');
const { sequelize } = require('../models/index');
var cos = require('../config/const'); 
const { v4: uuidV4 } = require('uuid')

router.get('/video', function(req, res, next) {
  res.json({ roomId: uuidV4() });
});

router.get('/video/:room', function(req, res, next) {
  res.render('room', { roomId: req.params.room })
});

// 特定のルームを取得
router.get('/direct/:id', auth.verifyToken, function(req, res, next) {
  db.DirectRoom.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: db.DirectMessage,
        required: false,
        attributes: ['message', 'file', [util.dateFormat('DirectMessages.createdAt'), 'createdAt'], [util.dateFormat('DirectMessages.updatedAt'), 'updatedAt']],
        include: {
          model: db.User,
          required: false,
          attributes: ['id', 'name', 'icon']
        },
        order: [['createdAt', 'desc']]
      }
    ]
  }).then(room => {
    res.json({ data: room });
  }).catch(err => {
    res.json({data: err});
  })
});

// ダイレクトメッセージ作成
router.get('/directmessages/latest/:id', auth.verifyToken, function(req, res, next) {
  db.DirectMessage.findOne({
    where: {
      roomId: req.params.id
    },
    attributes: ['message', 'file', [util.dateFormat('createdAt'), 'createdAt'], [util.dateFormat('updatedAt'), 'updatedAt']],
    order: [['createdAt', 'desc']],
    limit: 1
  }).then(msg => {
    res.json({ data: msg });
  }).catch(err => {
    res.json({data: err});
  })
});

// トークルーム一覧を取得
router.get('/:id', auth.verifyToken, function(req, res, next) {
  db.UserDirectRoom.findAll({
    where: {
      userId: req.params.id
    },
    include: [{
      model: db.User,
      required: false,
      attributes: ['id', 'name', 'icon'],
      include: [{
        model: db.DirectRoom,
        required: false,
        include: [{
          model: db.DirectMessage,
          required: false,
          attributes: ['message', 'file', [util.dateFormat('DirectMessage.createdAt'), 'createdAt'], [util.dateFormat('DirectMessage.updatedAt'), 'updatedAt']],
          order: [['createdAt', 'desc']],
          limit: 1
        }]
      }]
    }],
  }).then(rooms => {
    var user = '';
    var message = '';
    var data = [];
    for(let i=0; i < rooms.length; i++) {
      user = rooms[i].dataValues.User;
      message = user.DirectRooms[i].dataValues.DirectMessages[i].dataValues;
      data.push({
        id: rooms[i].dataValues.roomId,
        toUser: {
          id: user.id,
          name: user.name,
          icon: user.icon,
        },
        message: {
          message: message.message,
          file: message.file,
          createdAt: message.createdAt
        }
      });
    }
    res.json({ data: data });
  }).catch(err => {
    console.log(err);
    res.json({data: err});
  })
});

// ダイレクトトークルーム作成
router.post('/', auth.verifyToken, function(req, res, next) {
  sequelize.transaction(async function(tx) {
    const room = await db.DirectRoom.create({transaction: tx});
    const body = {
      userId: '',
      roomId: room.dataValues.id,
      toUserId: ''
    };
    var promises = [];
    for (let i=1; i <= 2; i++) {
      body['userId'] = i == 1 ? req.decoded.id : req.body.id;
      body['toUserId'] = i == 1 ? req.body.id : req.decoded.id;
      var newPromise = db.UserDirectRoom.create(body, {transaction: tx});
      promises.push(newPromise);
    }
    return Promise.all(promises);
  }).then(result => {
    var data = {
      success: true,
      message: 'トークルームを作成しました。'
    }
    res.json({data});
  }).catch(err => {
    var data = {
      success: false,
      err: err
    }
    res.json({data});
  });
});

// ダイレクトメッセージ作成
router.post('/:id/directmessages', auth.verifyToken, function(req, res, next) {
  console.log('hoge');
  const form = {
    userId: req.decoded.id,
    roomId: req.params.id,
    message: req.body.message,
    file: req.body.file
  }
  db.sequelize.sync().then(() => {
    db.DirectMessage.create(form).then(item => {
      var data = {
        success: true,
      }
      res.json({data});
    }).catch(err => {
      var data = {
        success: false,
        err: err
      }
      res.json({data});
    });
  });
});

module.exports = router;
