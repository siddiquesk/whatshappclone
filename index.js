const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const User = require("./models/User");
const cors=require("cors");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const engine = require("ejs-mate");
const crudcontroller = require("./controller/crudcontroller");
const usercontroller = require("./controller/usercontroller");
const PORT = 3000;
const DB_URL = process.env.MONGO_URL;
// MongoDB session store configuration
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600, // Reduces unnecessary session updates
});
// Express session configuration
const sessionOption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", engine);
app.use(cors());
// Middleware
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOption));
app.use(flash());

// Database connection
async function main() {
  await mongoose.connect(DB_URL);
  console.log("Database connected successfully");
}
main().catch((err) => console.log("Database connection error:", err));

// Passport authentication setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
// Middleware for passing flash messages & current user to templates
app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes

// Chat routes
app.get("/", crudcontroller.index);
app.get("/chats/new", crudcontroller.newForm);
app.post("/chats", crudcontroller.createChat);
app.get("/chats/:id/edit", crudcontroller.editForm);
app.put("/chats/:id", crudcontroller.editChat);
app.delete("/chats/:id", crudcontroller.destroyChat);

// Authentication routes
app.get("/signup", usercontroller.signupForm);
app.post("/signup", usercontroller.signupcreation);
app.get("/login", usercontroller.loginForm);
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password!",
    successFlash: "Welcome to WhatsApp Clone! Happy chatting! 😊",
    successRedirect: "/chats",
  })
);
app.get("/logout", usercontroller.logout);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});