'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDirectRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDirectRoom.belongsTo(models.User, {foreignKey: 'toUserId'});
      UserDirectRoom.belongsTo(models.DirectRoom, {foreignKey: 'roomId'});
    }
  };
  UserDirectRoom.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    roomId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    toUserId: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'UserDirectRoom',
  });
  return UserDirectRoom;
};