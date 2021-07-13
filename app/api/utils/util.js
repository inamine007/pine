const { sequelize } = require('../models/index');

exports.dateFormat = function(column) {
  return sequelize.fn('date_format', sequelize.col(column), '%Y-%m-%d %h:%m:%s');
}