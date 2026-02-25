const {
  Category,
  Order,
  Product,
  Profile,
  ProductCategory,
  OrderDetail,
  User,
} = require("../models");
const { Op } = require("sequelize");
const { formatRupiah } = require("../helpers/formatRupiah");
const user = require("../models/user");

class Controller {
  //---------
  // Product
  //---------
  static async productList(req, res) {
    try {
      let { search } = req.query;

      let option = {
        include: Category,
        order: [["createdAt", "DESC"]],
      };

      if (search) {
        option.where = {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }
      let data = await Product.findAll(option);

      res.render("products/index", {
        data,
        title: "All Products",
        formatRupiah,
        search,
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async productDetail(req, res) {
    try {
      const { id } = req.params;

      const data = await Product.findByPk(id, {
        include: Category,
      });

      res.render("products/detail", {
        data,
        title: data.name,
        user: req.session,
        formatRupiah,
      });
    } catch (error) {
      res.redirect("/products?error=" + encodeURIComponent(error.message));
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
      res.render("auth/login", { title: "Login" });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;

      User.login({ email, password }).then((user) => {
        if (!user) {
          throw new Error("Invalid email or password");
        }
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.username = user.username;
        return res.redirect("/products");
      });
    } catch (error) {
      return res.redirect("/login?error=" + error.message);
    }
  }
  static async getRegister(req, res) {
    try {
      res.render("auth/register", { title: "Register" });
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
  static async logout(req, res) {
    //logout
    req.session.destroy(() => {
      res.redirect("auth/login");
    });
  }

  //---------
  // Login, Register, Logout
  //---------

  //---------
  // Profiles
  //---------

  static async getProfile(req, res) {
    try {
      const data = await Profile.findOne({
        where: {
          userId: req.session.userId,
        },
        include: User,
      });

      if (!data) {
        return res.send("Profile not found");
      }

      res.render("profiles/index", { data, title: "Profiles" });
    } catch (error) {
      res.send(error);
    }
  }
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
