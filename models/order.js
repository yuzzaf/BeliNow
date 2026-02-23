"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User);
      Order.hasMany(models.OrderDetail);
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      orderAddress: DataTypes.STRING,
      orderDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Order",
    },
  );
  return Order;
};
