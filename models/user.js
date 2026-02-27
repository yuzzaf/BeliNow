"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Static auth helper for login flow in controller.
    static async login({ email, password }) {
      const normalizedEmail =
        typeof email === "string" ? email.trim().toLowerCase() : "";
      const rawPassword = typeof password === "string" ? password : "";

      if (!normalizedEmail || !rawPassword.trim()) {
        throw new Error("Email and password are required");
      }

      const user = await User.findOne({ where: { email: normalizedEmail } });

      if (!user) {
        throw new Error("Invalid email/password");
      }

      const isValid = bcrypt.compareSync(rawPassword, user.password);

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
        unique: {
          msg: "Email already registered",
        },
        set(value) {
          const normalizedEmail =
            typeof value === "string" ? value.trim().toLowerCase() : value;
          this.setDataValue("email", normalizedEmail);
        },
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          notNull: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Email format is invalid",
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
          len: {
            args: [8, 255],
            msg: "Password must be at least 8 characters",
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
          isIn: {
            args: [["buyer", "admin"]],
            msg: "Role is invalid",
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
