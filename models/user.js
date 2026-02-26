"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Static auth helper for login flow in controller.
    static async login({ email, password }) {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("Invalid email/password");
      }

      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        throw new Error("Invalid email/password");
      }

      return user;
    }
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: "userId",
      });
      User.hasMany(models.Order, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Username is required",
          },
          notNull: {
            msg: "Username is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password is required",
          },
          notNull: {
            msg: "Password is required",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Role is required",
          },
          notNull: {
            msg: "Role is required",
          },
        },
      },
    },
    {
      hooks: {
        // Hash plain password before persisting user record.
        beforeCreate(User, options) {
          const hashed = bcrypt.hashSync(User.password, 10);
          User.password = hashed;
        },
      },
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
