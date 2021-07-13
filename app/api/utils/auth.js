var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../config/config');

exports.verifyToken = function(req, res, next) {
  // header か　url parameters か post parametersからトークンを取得する
  // var token = req.body.token || req.query.token || req.headers['x-access-token'];
  const bearToken = req.headers['authorization'];
  const bearer = bearToken.split(' ')
  const token = bearer[1]

  if (token) {

    // jwtの認証をする
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, function(error, decoded) {
      if (error) {
        return res.sendStatus(401).send({
          success: false,
          message: 'トークンが無効です。'
        });
      } else {
        // 認証に成功したらdecodeされた情報をrequestに保存する
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // トークンがなければエラーを返す
    return res.status(403).send({
        success: false,
        message: 'トークンがありません。',
    });
  }
}

const saltRounds = 10;
//ハッシュを返す
exports.hashPass = function(password) {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hashed = bcrypt.hashSync(password, salt);
  return hashed;
}

//パスワードハッシュの比較
exports.verifyPass = function(passA, passB) {
  let pwcheck = bcrypt.compareSync(passA, passB);
  return pwcheck;
}
