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
const product = require("../models/product");

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
      let dataProduct = await Product.findAll()
      let categories = await Category.findAll()
      res.render("products/add", {dataProduct, categories, title:"Add Product"})
    } catch (error) {
      res.send(error);
    }
  }
  static async postAddProduct(req, res) {
    try {
      await Product.create({ 
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                categoryId: req.body.categoryId,
                stock: req.body.stock 
            });
      res.redirect('/products')
    } catch (error) {
      res.send(error);
    }
  }
  static async getEditProduct(req, res) {
    try {
      let {id} = req.params
      let product = await Product.findByPk(id) 
      let categories = await Category.findAll()      
      res.render('products/edit', {product, categories, title:"edit product"} )
    } catch (error) {
      res.send(error);
    }
  }
  static async postEditProduct(req, res) {
    try {
      await Product.update({
            title: req.body.title,
            storeName: req.body.storeName,
            price: req.body.price,
            stock: req.body.stock,
            imageURL: req.body.imageURL
      },{
        where: {id: req.params.id}
    })
    res.redirect('/products') 
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
       const categories = await Category.findAll({
        order: [["id", "ASC"]]
      });

      res.render("categories/index", {categories, title:"category-list"});
    } catch (error) {
      res.send(error);
    }
  }
  static async getAddCategory(req, res) {
    try {
      res.render("categories/add", {title:"add-category"});
    } catch (error) {
      res.send(error);
    }
  }
  static async postAddCategory(req, res) {
    try {
      const { name } = req.body;
      await Category.create({
        name: req.body.name
      });

      res.redirect("/categories");
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
      const userId = 1 // nanti ganti req.session.userId

const order = await Order.findOne({
  where: { userId },
  include: [
    {
      model: OrderDetail,
      include: [
        {
          model: Product
        }
      ]
    }
  ]
})
      res.render('orders/index', {order, title: "Shopping Cart"})
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
      const userId = 1 // nanti ganti req.session.userId
    const productId = +req.params.productId

    let order = await Order.findOne({
      where: { userId }
    })
    // kalau belum ada → buat order baru
    if (!order) {
      order = await Order.create({
        userId,
        orderDate: new Date(),
        orderAddress: ""
      })
    }

    // cek apakah product sudah ada di cart
    let orderDetail = await OrderDetail.findOne({
      where: {
        ordersId: order.id, // FIXED (bukan ordersId)
        productId
      }
    })

    if (orderDetail) {

      // tambah quantity +1
      await orderDetail.increment("quantity")

    } else {
         const product = await Product.findByPk(productId)
      await OrderDetail.create({
        ordersId: order.id, // FIXED
        productId,
        price: product.price,
        quantity: 1,
        status: "cart"
      })

    }

    res.redirect("/orders")
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

      const newUser = await User.create({
        username,
        email,
        password,
        role,
      });

      await Profile.create({
        userId: newUser.id,
        username: username,
        firstName: "",
        lastName: "",
        address: "",
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
    try {
      req.session.destroy(() => {
        res.redirect("/products");
      });
      res.clearCookie("connect.sid"); // hapus cookie
      res.redirect("/login");
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

      await Profile.findOrCreate({
        where: { userId: user.id },
        defaults: {
          username: user.username,
          firstName: "",
          lastName: "",
          address: "",
        },
      });

      // cek authorization
      if (req.session.username !== username && req.session.role !== "admin") {
        return res.redirect("/products");
      }

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
      res.send(error);
    }
  }

  //---------
  // Delete
  //---------

  static async deleteProduct(req, res) {
    try {
      const {id} = req.params
      await Product.destroy({
              where: {id},
            })
            res.redirect('/products')
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
