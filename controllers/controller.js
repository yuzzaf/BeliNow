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
      res.render('login.ejs')
    } catch (error) {
      console.log(error);      
      res.send(error);
    }
  }
  static async postLogin(req, res) {
    try {
      const { email, password } = req.body

            console.log("LOGIN INPUT:", email)

            const user = await User.findOne({ where: { email } })

            if (!user) {
            console.log("USER NOT FOUND")
            return res.redirect('/login')
            }

            const isValid = bcrypt.compareSync(password, user.password)

            if (!isValid) {
            console.log("PASSWORD WRONG")
            return res.redirect('/login')
            }

            req.session.userId = user.id
            req.session.role = user.role

            console.log("LOGIN SUCCESS")

            return res.redirect('/products')
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async getRegister(req, res) {
    try {
      res.render('register.ejs')
    } catch (error) {
      res.send(error);
    }
  }
  static async postRegister(req, res) {
    try {
      const { email, password, role } = req.body

        // basic validation
        if (!email || !password || !role) {
            return res.send('All fields are required')
        }

        // create user (password di-hash oleh model hook)
        await User.create({
            email,
            password,
            role
        })

        // redirect ke login setelah sukses
        res.redirect('/login')
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static logout(req, res) { //logout
        req.session.destroy(() => {
      res.redirect('login.ejs')
    })
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
