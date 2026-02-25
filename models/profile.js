"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Profile.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Profile",
    },
  );
  return Profile;
};
