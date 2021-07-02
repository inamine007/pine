'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Relationship);
    }
  };
  User.init({
    name: { 
      type:DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '名前は必ず入力してください。'
        },
        max: {
          args: [25],
          msg: '名前は25文字以内で入力してください。'
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: '名前は必ず入力してください。'
        },
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '名前は必ず入力してください。'
        },
      }
    },
    icon: DataTypes.STRING,
    background: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};