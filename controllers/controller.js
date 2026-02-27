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
      const { search, categoryId, message: notifDeleteProduct } = req.query;

      const option = {
        include: [
          {
            model: Category,
          },
        ],
        order: [["createdAt", "DESC"]],
      };

      // Search by product name using Sequelize Op + optional category filter.
      if (search) {
        option.where = {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }

      if (categoryId) {
        option.include[0].where = {
          id: +categoryId,
        };
      }

      const categories = await Category.findAll({
        order: [["name", "ASC"]],
      });
      const data = await Product.findAll(option);

      res.render("products/index", {
        data,
        categories,
        notifDeleteProduct,
        title: "All Products",
        formatRupiah,
        search,
        categoryId,
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
      const product = await Product.findByPk(id, {
        include: Category,
      });
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
      const order = await Order.findOne({
        where: { userId: req.session.userId },
        include: [
          {
            model: OrderDetail,
            where: { status: "cart" },
            required: true, // hanya order yang punya item cart
            include: [Product],
          },
        ],
        order: [["createdAt", "DESC"]], // ambil cart terbaru
      });

      res.render("orders/index", {
        order: order || null,
        title: "Shopping Cart",
        formatRupiah,
      });
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
            where: { status: "cart" },
            required: false,
            include: [Product],
          },
        ],
      });

      if (!order) return res.status(404).send("Order not found");

      if (order.userId !== req.session.userId && req.session.role !== "admin") {
        return res.redirect("/orders");
      }

      // kalau cart kosong, lempar ke history
      if (!order.OrderDetails || order.OrderDetails.length === 0) {
        return res.redirect("/orders/history");
      }

      const profile = await Profile.findOne({
        where: { userId: order.userId },
      });

      res.render("orders/detail", {
        order,
        profile,
        title: "Order Detail",
        formatRupiah,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async createOrder(req, res) {
    try {
      const userId = req.session.userId;
      const productId = +req.params.productId;
      const { next } = req.body;

      const product = await Product.findByPk(productId);
      if (!product) return res.redirect("/products?error=Product not found");

      const profile = await Profile.findOne({ where: { userId } });

      let order = await Order.findOne({
        where: { userId },
        include: [
          {
            model: OrderDetail,
            where: { status: "cart" },
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!order) {
        order = await Order.create({
          userId,
          orderDate: new Date(),
          orderAddress: profile?.address || "",
          quantity: 0,
        });
      }

      const existing = await OrderDetail.findOne({
        where: { orderId: order.id, productId, status: "cart" },
      });

      if (existing) {
        await existing.increment("quantity");
      } else {
        await OrderDetail.create({
          orderId: order.id,
          productId,
          price: product.price,
          quantity: 1,
          status: "cart",
        });
      }

      const totalQty = await OrderDetail.sum("quantity", {
        where: { orderId: order.id, status: "cart" },
      });

      await Order.update(
        {
          quantity: totalQty || 0,
          orderAddress: profile?.address || order.orderAddress || "",
        },
        { where: { id: order.id } },
      );

      if (next === "products") {
        return res.redirect("/products");
      }

      res.redirect("/orders");
    } catch (error) {
      res.send(error);
    }
  }

  static async increaseQty(req, res) {
    try {
      const { orderDetailId } = req.params;
      const item = await OrderDetail.findByPk(orderDetailId, {
        include: Order,
      });

      if (!item || item.Order.userId !== req.session.userId) {
        return res.redirect("/orders");
      }

      await item.increment("quantity");
      return res.redirect("/orders");
    } catch (error) {
      res.send(error);
    }
  }

  static async decreaseQty(req, res) {
    try {
      const { orderDetailId } = req.params;
      const item = await OrderDetail.findByPk(orderDetailId, {
        include: Order,
      });

      if (!item || item.Order.userId !== req.session.userId) {
        return res.redirect("/orders");
      }

      if (item.quantity <= 1) {
        await item.destroy();
      } else {
        await item.decrement("quantity");
      }

      return res.redirect("/orders");
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteCartItem(req, res) {
    try {
      const { orderDetailId } = req.params;
      const item = await OrderDetail.findByPk(orderDetailId, {
        include: Order,
      });

      if (!item || item.Order.userId !== req.session.userId) {
        return res.redirect("/orders");
      }

      await item.destroy();
      return res.redirect("/orders");
    } catch (error) {
      res.send(error);
    }
  }

  static async checkoutOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [{ model: OrderDetail, include: [Product] }],
      });

      if (!order) return res.status(404).send("Order not found");
      if (order.userId !== req.session.userId && req.session.role !== "admin") {
        return res.redirect("/orders");
      }

      // Stripe Checkout line items are generated from cart-only order details.
      const line_items = order.OrderDetails.filter(
        (item) => item.status === "cart",
      ).map((item) => ({
        price_data: {
          currency: "idr",
          product_data: { name: item.Product?.name || "Product" },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      }));

      if (!line_items.length) return res.redirect("/orders");

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const baseUrl = (process.env.BASE_URL || "").replace(/\/+$/, "");

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        success_url: `${baseUrl}/orders/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${baseUrl}/orders/checkout/cancel?order_id=${order.id}`,
        client_reference_id: String(order.id),
        metadata: {
          orderId: String(order.id),
          userId: String(req.session.userId),
        },
      });

      return res.redirect(303, session.url);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkoutSuccess(req, res) {
    try {
      const { session_id, order_id } = req.query;

      if (!session_id || !order_id) {
        return res.redirect("/orders");
      }

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== "paid") {
        return res.redirect(`/orders/${order_id}?payment=unpaid`);
      }

      const order = await Order.findByPk(order_id);
      if (!order) return res.redirect("/orders");

      if (order.userId !== req.session.userId && req.session.role !== "admin") {
        return res.redirect("/orders");
      }

      const profile = await Profile.findOne({
        where: { userId: order.userId },
      });

      await Order.update(
        { orderAddress: profile?.address || "" },
        { where: { id: order.id } },
      );

      await OrderDetail.update(
        { status: "paid" },
        { where: { orderId: order.id, status: "cart" } },
      );

      await Order.update({ quantity: 0 }, { where: { id: order.id } });

      return res.redirect("/orders/history");
    } catch (error) {
      res.send(error);
    }
  }

  static async checkoutCancel(req, res) {
    try {
      const { order_id } = req.query;
      if (order_id) {
        return res.redirect(`/orders/${order_id}?payment=cancel`);
      }
      return res.redirect("/orders");
    } catch (error) {
      res.send(error);
    }
  }

  static async orderHistory(req, res) {
    try {
      const whereClause =
        req.session.role === "admin" ? {} : { userId: req.session.userId };

      const orders = await Order.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: OrderDetail,
            where: { status: "paid" },
            required: true,
            include: [Product],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.render("orders/history", {
        orders,
        title: "Order History",
        formatRupiah,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id);
      if (!order) return res.redirect("/orders");
      if (order.userId !== req.session.userId && req.session.role !== "admin") {
        return res.redirect("/orders");
      }

      await Order.destroy({ where: { id } });
      return res.redirect("/orders/history");
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
      const errors = req.query.error
        ? decodeURIComponent(req.query.error)
            .split("|")
            .filter(Boolean)
        : [];

      const formData = {
        username: req.query.username || "",
        email: req.query.email || "",
        role: req.query.role || "",
      };

      res.render("auth/register", { title: "Register", errors, formData });
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
        firstName: newUser.username,
        lastName: "-",
        address: "-",
      });

      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        const { username, email, role } = req.body;
        return res.redirect(
          "/register?error=" +
            encodeURIComponent(errors.join("|")) +
            `&username=${encodeURIComponent(username || "")}` +
            `&email=${encodeURIComponent(email || "")}` +
            `&role=${encodeURIComponent(role || "")}`,
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
      const errors = req.query.error
        ? decodeURIComponent(req.query.error)
            .split("|")
            .filter(Boolean)
        : [];
      const formData = {
        username: req.query.username || "",
        firstName: req.query.firstName || "",
        lastName: req.query.lastName || "",
        address: req.query.address || "",
      };

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

      if (!formData.username) formData.username = data?.User?.username || "";
      if (!formData.firstName) formData.firstName = data?.firstName || "";
      if (!formData.lastName) formData.lastName = data?.lastName || "";
      if (!formData.address) formData.address = data?.address || "";

      res.render("profiles/edit", {
        data,
        errors,
        formData,
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

      await User.update(
        { username: newUsername },
        {
          where: { id: user.id },
          validate: true,
        },
      );
      await Profile.update(
        { firstName, lastName, address },
        {
          where: { userId: user.id },
          validate: true,
        },
      );

      if (req.session.userId === user.id) {
        req.session.username = newUsername;
      }

      return res.redirect(`/profiles/${newUsername}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        const {
          username: newUsername = "",
          firstName = "",
          lastName = "",
          address = "",
        } = req.body;
        return res.redirect(
          `/profiles/${req.params.username}/edit?error=${encodeURIComponent(errors.join("|"))}` +
            `&username=${encodeURIComponent(newUsername || "")}` +
            `&firstName=${encodeURIComponent(firstName || "")}` +
            `&lastName=${encodeURIComponent(lastName || "")}` +
            `&address=${encodeURIComponent(address || "")}`,
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
