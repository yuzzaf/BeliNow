const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Import Routes
const routes = require("./routes");

// ======================
// MIDDLEWARE
// ======================

// Body parser
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Static folder (css, images, etc)
// app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
// app.set("views", path.join(__dirname, "views"));

// ======================
// ROUTES
// ======================

app.use(routes);

// ======================
// 404 HANDLER
// ======================

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// ======================
// SERVER
// ======================

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// ======================
// SERVER ERROR
// ======================
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
});
