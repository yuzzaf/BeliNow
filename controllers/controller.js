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
      let notifDeleteProduct = req.query.message

      let data = await Product.findAll({
        include: Category,

        order: [["createdAt", "DESC"]],
        limit: 8,
      });

      res.render("products/index", {data, notifDeleteProduct, title: "All Products", formatRupiah,
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
      const { name, price, imageUrl, description, categoryId, stock } = req.body;
      const product = await Product.create({
        name,
        price,
        imageUrl,
        description,
        stock
      });
    await ProductCategory.create({
      productId: product.id,
      categoryId: categoryId
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
      const productId = req.params.id;
      const { title, storeName, price, stock, imageURL, categoryId } = req.body;
      await Product.update({
      title,
      storeName,
      price,
      stock,
      imageURL
    }, {
      where: { id: productId }
    });

    await ProductCategory.destroy({
      where: { productId }
    });

    await ProductCategory.create({
      productId,
      categoryId
    });
    
    res.redirect('/products') 
    } catch (error) {
      res.send(error);
    }
  }
  static async deleteProduct(req,res){
    try {
            let findProduct = await Product.findByPk(req.params.id)
            let productName = findProduct.name
            await findProduct.destroy()
            res.redirect(`/products/?message=${productName} removed!`)
    } catch (error) {
      res.send(error)
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
      let notifDeleteCategory = req.query.message

      const categories = await Category.findAll({
      order: [["id", "ASC"]]
    });

      res.render("categories/index", {categories, notifDeleteCategory, title:"category-list"});
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
  static async deleteCategory(req,res){
    try {
            let findCategory = await Category.findByPk(req.params.id)
            let categoryName = findCategory.name
            await findCategory.destroy()
            res.redirect(`/categories/?message=${categoryName} removed!`)
    } catch (error) {
      res.send(error)
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

}

module.exports = Controller;
