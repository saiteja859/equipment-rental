// function ensureAuthenticated(req, res, next) {
//   console.log("🔍 Checking authentication:", req.session);

//   if (req.session && req.session.user && req.session.user._id) {
//       console.log("✅ User is authenticated:", req.session.user);
//       return next();
//   }

//   console.log("🚨 User not authenticated.");
//   res.status(401).send("User not authenticated.");
// }

// function ensureAuthenticated(req, res, next) {
//   if (req.session.user) {
//     return next();
//   }
//   res.redirect("/login"); // Redirect to login instead of home if not authenticated
// }


// function ensureAuthenticated(req, res, next) {
//   if (req.session && req.session.user) {
//       req.user = req.session.user; // ✅ Attach user to request
//       return next();
//   }
//   return res.status(401).json({ error: "User not authenticated" });
// }
// function ensureAuthenticated(req, res, next) {
//   console.log("🔍 Checking authentication - Session Data:", req.session);

//   if (req.session && req.session.user) {
//       req.user = req.session.user; // ✅ Attach user to request
//       console.log("✅ User is authenticated:", req.user);
//       return next();
//   }

//   console.log("🚨 User not authenticated. Redirecting to login.");
//   return res.redirect("/login");
// }

// module.exports = { ensureAuthenticated };
function ensureAuthenticated(req, res, next) {
  console.log("🔍 Checking authentication:", req.session);

  if (req.session && req.session.user) {
      req.user = req.session.user; // ✅ Attach user to request
      console.log("✅ User is authenticated:", req.user);
      return next();
  }

  console.log("🚨 User not authenticated.");
  res.redirect("/login"); // ✅ Redirect to login instead of sending JSON
}

module.exports = { ensureAuthenticated };
