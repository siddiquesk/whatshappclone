const User = require("../models/User"); // Importing User model for database operations
// Renders the sign-up form
module.exports.signupForm = (req, res) => {
  res.render("users/signup"); // This will render the signup page for the user
};
// Handles the sign-up creation process (user registration)
module.exports.signupcreation = async (req, res) => {
  // Extract user input (username, email, and password) from the request body
  const { username, email, password } = req.body;
  try {
    // Create a new User instance with the provided username and email
    const newuser = new User({ username, email });
    // Register the user by calling User.register method, passing the new user instance and password
    const registeredUser = await User.register(newuser, password);
    // After successful registration, automatically log the user in
    req.login(registeredUser, (err) => {
      if (err) {
        // If there's an error logging in the user, flash an error message and redirect to login page
        req.flash("error", "Login failed after signup");
        return res.redirect("/login");
      }
      // If login is successful, flash a success message and redirect to the chats page
      req.flash("success", "Sign up successful");
      res.redirect("/chats");
    });

  } catch (err) {
    // If any error occurs during user registration (e.g., duplicate email), flash an error message and redirect to signup page
    req.flash("error", "Signup failed: " + err.message);
    res.redirect("/signup");
  }
};

// Renders the login form
module.exports.loginForm = (req, res) => {
  res.render("users/login"); // This will render the login page for the user
};
// Handles the user logout process
module.exports.logout = (req, res, next) => {
  // Logout the user and clear the session
  req.logout((err) => {
    if (err) {
      // If there's an error logging out, pass it to the next middleware to handle
      return next(err);
    }
    // If logout is successful, flash a success message and redirect to the chats page
    req.flash("success", "Logged out successfully");
    res.redirect("/chats");
  });
};
