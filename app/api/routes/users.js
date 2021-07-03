var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
var auth = require('../utils/auth');
const { sequelize } = require('../models/index');
var cos = require('../config/const'); 

// 登録ユーザーを全て取得(※登録人数が増えた場合を想定しない場合)
router.get('/', auth.verifyToken, function(req, res, next) {
  db.User.findAll().then(users => {
    var data = [];
    for(let i=0; i < users.length; i++) {
      data.push({
        'id': users[i].dataValues.id,
        'name': users[i].dataValues.name,
        'icon': users[i].dataValues.icon
      });
    }
    res.json({ data: data });
  })  
});

// 自分自身の情報を取得
router.get('/me', auth.verifyToken, function(req, res, next) {
  db.User.findByPk(req.decoded.id).then(usr => {
    var data = {
      'id': usr.dataValues.id,
      'name': usr.dataValues.name,
      'email': usr.dataValues.email,
      'password': usr.dataValues.password,
      'icon': usr.dataValues.icon,
      'background': usr.dataValues.background,
    }
    res.json({ data: data });
  }).catch(err => {
    var data = {
      'message': 'ユーザーが見つかりませんでした。'
    }
    res.json({ data: data });
  });
});

// 友達一覧を取得
router.get('/friends', auth.verifyToken, function(req, res, next) {
  var user_id = req.decoded.id;
  db.User.findAll({
    where: {
      id: [
        sequelize.literal(`(
          SELECT re.toUserId
          FROM Users AS us
          INNER JOIN Relationships AS re
          ON us.id = re.fromUserId
          WHERE us.id = ${user_id}
          AND re.friendFlg = ${cos.FRIEND_ADD}
        )`)
      ]
    },
  }).then(users => {
    var data = [];
    for(let i=0; i < users.length; i++) {
      data.push({
        'id': users[i].dataValues.id,
        'name': users[i].dataValues.name,
        'icon': users[i].dataValues.icon,
        'friend': true
      });
    }
    res.json({ data: data });
  }).catch(err => {
    var data = {
      'message': err
    }
    res.json({data: data});
  });
});

// ブロックしているユーザー一覧を取得
router.get('/blocks', auth.verifyToken, function(req, res, next) {
  var user_id = req.decoded.id;
  db.User.findAll({
    where: {
      id: [
        sequelize.literal(`(
          SELECT re.blockedUserId
          FROM Users AS us
          INNER JOIN Relationships AS re
          ON us.id = re.fromUserId
          WHERE us.id = ${user_id}
          AND re.blockFlg = ${cos.BLOCK_ADD}
        )`)
      ]
    },
  }).then(users => {
    var data = [];
    for(let i=0; i < users.length; i++) {
      data.push({
        'id': users[i].dataValues.id,
        'name': users[i].dataValues.name,
        'icon': users[i].dataValues.icon,
        'blocked': true
      });
    }
    res.json({ data: data });
  }).catch(err => {
    var data = {
      'message': err
    }
    res.json({data: data});
  });
});

// ブロックしている特定のユーザー情報を取得
router.get('/blocks/:id', auth.verifyToken, function(req, res, next) {
  db.User.findByPk(req.params.id).then(usr => {
    var data = {
      'id': usr.dataValues.id,
      'name': usr.dataValues.name,
      'icon': usr.dataValues.icon,
      'background': usr.dataValues.background,
      'blocked': true
    }
    res.json({ data: data });
  }).catch(err => {
    var data = {
      'message': 'ユーザーが見つかりませんでした。'
    }
    res.json({ data: data });
  });
});

// 特定のお友達情報を取得
router.get('/friends/:id', auth.verifyToken, function(req, res, next) {
  db.User.findByPk(req.params.id).then(usr => {
    var data = {
      'id': usr.dataValues.id,
      'name': usr.dataValues.name,
      'icon': usr.dataValues.icon,
      'background': usr.dataValues.background,
      'friend': true
    }
    res.json({ data: data });
  }).catch(err => {
    var data = {
      'message': 'ユーザーが見つかりませんでした。'
    }
    res.json({ data: data });
  });
});

// 特定のユーザー情報を取得
router.get('/:id', auth.verifyToken, function(req, res, next) {
  db.User.findByPk(req.params.id).then(usr => {
    var data = {
      'id': usr.dataValues.id,
      'name': usr.dataValues.name,
      'icon': usr.dataValues.icon,
      'background': usr.dataValues.background,
    }
    res.json({ data: data });
  }).catch(err => {
    var data = {
      'message': 'ユーザーが見つかりませんでした。'
    }
    res.json({ data: data });
  });
});

// ユーザーをブロック
router.post('/blocks', auth.verifyToken, function(req, res, next) {
  var user_name = req.body.name;
  const body = {
    fromUserId: req.decoded.id,
    toUserId: req.body.id,
    blockFlg: cos.BLOCK_ADD
  }
  db.Relationship.findOne({
    attributes: ['id'],
    where: {
      fromUserId: req.decoded.id,
      toUserId: req.body.id,
    }
  }).then(data => {
    db.sequelize.sync().then(() => {
      if (!data) {
        db.Relationship.create(body).then(item => {
          var data = {
            success: true,
            message: user_name + 'さんをブロックしました。',
          }
          res.json({data});
        }).catch(err => {
          var data = {
            success: false,
            err: err,
            message: 'ブロックに失敗しました。',
          }
          res.json({data});
        });
      } else {
        db.Relationship.update({
          blockFlg: cos.BLOCK_ADD
        },
        {
          where:{
            id: data.dataValues.id
          }
        }).then(usr => {
          var data = {
            'success': true,
            'message': user_name + 'さんをブロックしました。',
          }
          res.json({data: data});      
        }).catch(err => {
          var data = {
            success: false,
            err: err,
            message: 'ブロックに失敗しました。',
          }
          res.json({data: data});
        });
      }
    });
  })
});

// 友達追加
router.post('/friends', auth.verifyToken, function(req, res, next) {
  var friend_name = req.body.name;
  const body = {
    fromUserId: req.decoded.id,
    toUserId: req.body.id,
    friendFlg: cos.FRIEND_ADD
  }
  db.Relationship.findOne({
    attributes: ['id'],
    where: {
      fromUserId: req.decoded.id,
      toUserId: req.body.id,
    }
  }).then(data => {
    db.sequelize.sync().then(() => {
      if (!data) {
        db.Relationship.create(body).then(item => {
          var data = {
            success: true,
            message: friend_name + 'さんをお友達に追加しました。',
          }
          res.json({data});
        }).catch(err => {
          var data = {
            success: false,
            err: err,
            message: 'お友達を追加できませんでした。',
          }
          res.json({data});
        });
      } else {
        db.Relationship.update({
          friendFlg: cos.FRIEND_ADD
        },
        {
          where:{
            id: data.dataValues.id
          }
        }).then(usr => {
          var data = {
            'success': true,
            'message': friend_name + 'さんをお友達に追加しました。',
          }
          res.json({data: data});      
        }).catch(err => {
          var data = {
            success: false,
            err: err,
            message: 'お友達を追加できませんでした。',
          }
          res.json({data: data});
        });
      }
    });
  })
});

// 友達削除
router.delete('/friends', auth.verifyToken, function(req, res, next) {
  var friend_name = req.body.name;
  db.sequelize.sync().then(() => {
    db.Relationship.update({
      friendFlg: cos.FRIEND_REMOVE
    },
    {
      where:{
        fromUserId:req.decoded.id,
        toUserId:req.body.id,
      }
    }).then(usr => {
      var data = {
        'success': true,
        'message': friend_name + 'さんを友達から削除しました。',
      }
      res.json({data: data});      
    }).catch(err => {
      var data = {
        'success': false,
        'message': err,
      }
      res.json({data: data});
    });
  })
});

// ブロック解除
router.delete('/blocks', auth.verifyToken, function(req, res, next) {
  var friend_name = req.body.name;
  db.sequelize.sync().then(() => {
    db.Relationship.update({
      blockFlg: cos.BLOCK_REMOVE
    },
    {
      where:{
        fromUserId:req.decoded.id,
        toUserId:req.body.id,
      }
    }).then(usr => {
      var data = {
        'success': true,
        'message': friend_name + 'さんのブロックを解除しました。',
      }
      res.json({data: data});      
    }).catch(err => {
      var data = {
        'success': false,
        'message': err,
      }
      res.json({data: data});
    });
  })
});

// プロフィール情報を更新
router.put('/me', auth.verifyToken, function(req, res, next) {
  db.sequelize.sync().then(() => {
    db.User.update({
      'name': req.body.name,
      'password': auth.hashPass(req.body.password),
      'email': req.body.email,
      'icon': req.body.icon,
      'background': req.body.background
    },
    {
      where:{id:req.decoded.id}
    }).then(usr => {
      if (usr == 1) {
        var data = {
          success: true,
          message: 'プロフィールを更新しました。',
          user: {
            'name': req.body.name,
            'email': req.body.email,
            'icon': req.body.icon,
            'background': req.body.background,
          }
        }
        res.json({data: data});
      } else {
        var data = {
          'success': false,
          'message': 'ユーザーが見つかりませんでした。',
        }
        res.json({data: data});
      }
    });
  });
});

// 退会
router.delete('/me', auth.verifyToken, function(req, res, next) {
  db.sequelize.sync().then(() => {
    db.User.destroy({
      where:{id:req.decoded.id}
    }).then(usr => {
      var data = {
        'success': true,
        'message': '退会しました。ご利用ありがとうございます。',
      }
      res.json({data: data});
    }).catch(err => {
      var data = {
        'success': false,
        'message': err,
      }
      res.json({data: data});
    });
  })
});


module.exports = router;
