const { sequelize } = require('../models/index');

exports.dateFormat = function(column) {
  return sequelize.fn('date_format', sequelize.col(column), '%Y-%m-%d %h:%m:%s');
}

exports.dateFormatToJST = function(d) {
  let year = d.getFullYear();
  let month = ('0' + (d.getMonth() + 1)).slice(-2);
  let day = ('0' + d.getDate()).slice(-2);
  let hour = ('0' + (d.getHours() + 9)).slice(-2);
  let minute = ('0' + d.getMinutes()).slice(-2);
  let second = ('0' + d.getSeconds()).slice(-2);
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}