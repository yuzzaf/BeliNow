const {
  Category,
  Order,
  Product,
  Profile,
  ProductCategory,
  OrderDetail,
  User,
} = require("../models");
const { formatRupiah } = require("../helpers/formatRupiah");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");

class Controller {
  //---------
  // Product
  //---------
  static async productList(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async productDetail(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async getAddProduct(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async postAddProduct(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async getEditProduct(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async postEditProduct(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  //---------
  // Product
  //---------

  //---------
  // Category
  //---------
  static async categoryList(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async getAddCategory(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async postAddCategory(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }

  //---------
  // Category
  //---------

  //---------
  // Order
  //---------
  static async orderList(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async orderDetail(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async createOrder(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }

  //---------
  // Order
  //---------

  //---------
  // Login, Register, Logout
  //---------

  static async getLogin(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async postLogin(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async getRegister(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async postRegister(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
  static async logout(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }

  //---------
  // Login, Register, Logout
  //---------

  //---------
  // Delete
  //---------

  static async deleteProduct(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
