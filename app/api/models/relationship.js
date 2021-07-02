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
      Relationship.belongsTo(models.User, {foreignKey: 'userId'});
    }
  };
  Relationship.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    friendId: DataTypes.INTEGER,
    blockedUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Relationship',
  });
  return Relationship;
};