'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DirectMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DirectMessage.belongsTo(models.User, {foreignKey: 'userId'});
      DirectMessage.belongsTo(models.DirectRoom, {foreignKey: 'roomId'});
    }
  };
  DirectMessage.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    roomId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    message: DataTypes.TEXT,
    file: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'DirectMessage',
  });
  return DirectMessage;
};