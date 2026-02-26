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

class Controller {
  //---------
  // Product
  //---------
  static async productList(req, res) {
    try {
      const { search, message: notifDeleteProduct } = req.query;

      const option = {
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

      const data = await Product.findAll(option);

      res.render("products/index", {
        data,
        notifDeleteProduct,
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
      const data = await Product.findByPk(id, { include: Category });

      if (!data) {
        return res.status(404).send("Product not found");
      }

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
      const categories = await Category.findAll();
      res.render("products/add", {
        categories,
        title: "Add Product",
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddProduct(req, res) {
    try {
      const { name, price, imageUrl, description, categoryId, stock } =
        req.body;

      const newProduct = await Product.create({
        name,
        price,
        imageUrl,
        description,
        stock,
      });

      if (categoryId) {
        await ProductCategory.create({
          productId: newProduct.id,
          categoryId: +categoryId,
        });
      }

      res.redirect("/products");
    } catch (error) {
      res.send(error);
    }
  }

  static async getEditProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, { include: Category });
      const categories = await Category.findAll();

      if (!product) {
        return res.status(404).send("Product not found");
      }

      res.render("products/edit", {
        product,
        categories,
        title: "Edit Product",
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditProduct(req, res) {
    try {
      const productId = +req.params.id;
      const { name, price, imageUrl, description, stock, categoryId } =
        req.body;

      await Product.update(
        {
          name,
          price,
          imageUrl,
          description,
          stock,
        },
        {
          where: { id: productId },
        },
      );

      await ProductCategory.destroy({ where: { productId } });

      if (categoryId) {
        await ProductCategory.create({
          productId,
          categoryId: +categoryId,
        });
      }

      res.redirect("/products");
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const findProduct = await Product.findByPk(id);

      if (!findProduct) {
        return res.redirect("/products?message=Product not found");
      }

      const productName = findProduct.name;
      await findProduct.destroy();

      res.redirect(
        `/products?message=${encodeURIComponent(productName + " removed!")}`,
      );
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
      const notifDeleteCategory = req.query.message;

      const categories = await Category.findAll({
        order: [["id", "ASC"]],
      });

      res.render("categories/index", {
        categories,
        notifDeleteCategory,
        title: "category-list",
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddCategory(req, res) {
    try {
      res.render("categories/add", { title: "add-category" });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddCategory(req, res) {
    try {
      const { name } = req.body;
      await Category.create({ name });
      res.redirect("/categories");
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteCategory(req, res) {
    try {
      const findCategory = await Category.findByPk(req.params.id);

      if (!findCategory) {
        return res.redirect("/categories?message=Category not found");
      }

      const categoryName = findCategory.name;
      await findCategory.destroy();

      res.redirect(
        `/categories?message=${encodeURIComponent(categoryName + " removed!")}`,
      );
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
      const userId = req.session.userId;

      const order = await Order.findOne({
        where: { userId },
        include: [
          {
            model: OrderDetail,
            include: [Product],
          },
        ],
      });

      res.render("orders/index", { order, title: "Shopping Cart" });
    } catch (error) {
      res.send(error);
    }
  }

  static async orderDetail(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderDetail,
            include: [Product],
          },
        ],
      });

      if (!order) {
        return res.status(404).send("Order not found");
      }

      res.render("orders/detail", {
        order,
        title: "Order Detail",
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async createOrder(req, res) {
    try {
      const userId = req.session.userId;
      const productId = +req.params.productId;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.redirect("/products?error=Product not found");
      }

      let order = await Order.findOne({ where: { userId } });
      if (!order) {
        order = await Order.create({
          userId,
          orderDate: new Date(),
          orderAddress: "",
        });
      }

      const orderDetail = await OrderDetail.findOne({
        where: {
          ordersId: order.id,
          productId,
        },
      });

      if (orderDetail) {
        await orderDetail.increment("quantity");
      } else {
        await OrderDetail.create({
          ordersId: order.id,
          productId,
          price: product.price,
          quantity: 1,
          status: "cart",
        });
      }

      res.redirect("/orders");
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
      res.send(error);
    }
  }

  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.login({ email, password });

      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.username = user.username;

      return res.redirect("/products");
    } catch (error) {
      return res.redirect("/login?error=" + encodeURIComponent(error.message));
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

      const newUser = await User.create({
        username,
        email,
        password,
        role,
      });

      await Profile.create({
        userId: newUser.id,
        firstName: "",
        lastName: "",
        address: "",
      });

      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        return res.redirect(
          "/register?error=" + encodeURIComponent(errors.join(", ")),
        );
      }
      res.send(error);
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
      });
    } catch (error) {
      res.send(error);
    }
  }
  //---------
  // Login, Register, Logout
  //---------

  //---------
  // Profiles
  //---------
  static async getProfile(req, res) {
    try {
      const { username } = req.params;

      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(404).send("User not found");

      if (req.session.username !== username && req.session.role !== "admin") {
        return res.redirect("/products");
      }

      await Profile.findOrCreate({
        where: { userId: user.id },
        defaults: {
          firstName: "",
          lastName: "",
          address: "",
        },
      });

      const data = await Profile.findOne({
        where: { userId: user.id },
        include: User,
      });

      res.render("profiles/index", {
        data,
        title: `${username}'s Profile`,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async getProfileEdit(req, res) {
    try {
      const { username } = req.params;

      if (req.session.username !== username && req.session.role !== "admin") {
        return res.redirect("/products");
      }

      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(404).send("User not found");

      await Profile.findOrCreate({
        where: { userId: user.id },
        defaults: {
          firstName: "",
          lastName: "",
          address: "",
        },
      });

      const data = await Profile.findOne({
        where: { userId: user.id },
        include: User,
      });

      res.render("profiles/edit", {
        data,
        title: `Edit ${username}'s Profile`,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async postProfileEdit(req, res) {
    try {
      const { username } = req.params;
      const { username: newUsername, firstName, lastName, address } = req.body;

      if (req.session.username !== username && req.session.role !== "admin") {
        return res.redirect("/products");
      }

      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(404).send("User not found");

      await Profile.findOrCreate({
        where: { userId: user.id },
        defaults: {
          firstName: "",
          lastName: "",
          address: "",
        },
      });

      await User.update({ username: newUsername }, { where: { id: user.id } });
      await Profile.update(
        { firstName, lastName, address },
        { where: { userId: user.id } },
      );

      if (req.session.userId === user.id) {
        req.session.username = newUsername;
      }

      return res.redirect(`/profiles/${newUsername}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        return res.redirect(
          `/profiles/${req.params.username}/edit?error=${encodeURIComponent(errors.join(", "))}`,
        );
      }
      res.send(error);
    }
  }
  //---------
  // Profiles
  //---------
}

module.exports = Controller;
