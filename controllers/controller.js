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
const product = require("../models/product");

class Controller {
  //---------
  // Product
  //---------
  static async productList(req, res) {
    try {
      let data = await Product.findAll({
        include: Category,

        order: [["createdAt", "DESC"]],
        limit: 8,
      });

      res.render("products/index", {
        data,
        title: "All Products",
        formatRupiah,
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

      const user = await User.login({ email, password });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      return res.redirect("/products");
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
