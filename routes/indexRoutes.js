const express = require("express");
const router = express.Router();

// Ensure user is authenticated before accessing the dashboard
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect to login if not authenticated
};

// Dashboard Route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user || {} });
});

module.exports = router;
