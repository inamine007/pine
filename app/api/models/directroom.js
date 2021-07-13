'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DirectRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DirectRoom.hasMany(models.DirectMessage, {foreignKey: 'roomId'});
      DirectRoom.belongsToMany(models.User, {through: models.UserDirectRoom, foreignKey: 'roomId'});
    }
  };
  DirectRoom.init({
    
  }, {
    sequelize,
    modelName: 'DirectRoom',
  });
  return DirectRoom;
};