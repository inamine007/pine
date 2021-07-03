'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Relationship.belongsTo(models.User, {foreignKey: 'fromUserId'});
    }
  };
  Relationship.init({
    fromUserId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    toUserId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    friendFlg: {
      type: DataTypes.STRING(1),
      defaultValue: "0"
    },
    blockFlg: {
      type: DataTypes.STRING(1),
      defaultValue: "0"
    },
  }, {
    sequelize,
    modelName: 'Relationship',
  });
  return Relationship;
};