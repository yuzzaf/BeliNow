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
      res.render("auth/login");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.login({ email, password });

      req.session.userId = user.id;
      req.session.role = user.role;

      return res.redirect("/products");
    } catch (error) {
      return res.redirect("/login?error=" + error.message);
    }
  }
  static async getRegister(req, res) {
    try {
      res.render("auth/register");
    } catch (error) {
      res.send(error);
    }
  }
  static async postRegister(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // create user (password di-hash oleh model hook)
      await User.create({
        username,
        email,
        password,
        role,
      });

      // redirect ke login setelah sukses
      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        return res.redirect("/register?error=" + errors.join(", "));
      }
      res.send(error);
    }
  }
  static logout(req, res) {
    //logout
    req.session.destroy(() => {
      res.redirect("auth/login");
    });
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
