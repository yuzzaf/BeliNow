require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 jam
    },
  }),
);

// User session ke view
app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? {
        id: req.session.userId,
        role: req.session.role,
        username: req.session.username,
      }
    : null;
  next();
});

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

// Routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
