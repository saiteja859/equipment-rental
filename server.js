const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const methodOverride = require("method-override");
const Item = require("./models/item");
const User = require("./models/User");
const Rental = require("./models/rental");



const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Prevent model recompilation
// const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;






const app = express();
app.use(methodOverride("_method"));
app.use(express.static("assets"));
const router = express.Router();

// At the bottom of server.js
app.use(router);

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "yourSecretKey",   // Change this to a secure secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   // Change to `true` if using HTTPS
}));


// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/equipment-rental", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Multer Storage Setup for Image Uploads
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🔹 Middleware for Authentication
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// 🏠 Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// 📌 Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// 📌 Handle Signup
// 📌 Handle Signup
app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.send("Please enter a username and password.");
  }

  try {
      // Check if user already exists
      let existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.send("Username already exists. Try a different one.");
      }

      // Create new user
      const newUser = new User({ username, password });
      await newUser.save();

      req.session.user = { id: newUser._id, username: newUser.username };
      console.log("✅ User registered:", req.session.user);
      res.redirect("/dashboard");
  } catch (err) {
      console.error("❌ Signup Error:", err);
      res.status(500).send("Error signing up.");
  }
});

// 📌 Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

// 📌 Handle Login
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
      return res.status(401).send("User not found.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return res.status(401).send("Invalid credentials.");
  }

  // ✅ Store user data in session
  req.session.user = { _id: user._id, username: user.username };
  console.log("✅ User authenticated:", req.session.user);

  res.redirect("/dashboard");
});



//debug
app.get("/session-check", (req, res) => {
  console.log("🔍 Current Session Data:", req.session);
  res.send(req.session);
});



// 📌 Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// 📌 Dashboard
app.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const items = await Item.find({ status: "Available" }).populate("owner"); // ✅ Fix applied

    res.render("dashboard", { user: req.session.user, items: items || [] });
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.redirect("/");
  }
});




// 📌 Show given items
app.get("/givenitems", async (req, res) => {
  console.log("Session Data in /givenitems:", req.session.user); // Debugging

  if (!req.session.user) {
      return res.redirect("/login");
  }

  try {
      const items = await Item.find().populate("owner"); // Fetch all items including owner details
      console.log("Fetched All Items:", items); // Debugging
      res.render("givenitems", { user: req.session.user, items }); // Pass all items
  } catch (err) {
      console.error("Error fetching items:", err);
      res.redirect("/");
  }
});




// 📌 Show rented items
// app.get("/renteditems", ensureAuthenticated, async (req, res) => {
//   try {
//     const rentedItems = await Rental.find({ "renterDetails.fullName": req.session.user.fullName, status: "approved" })
//       .populate("itemId");

//     res.render("renteditems", { user: req.session.user, rentedItems });
//   } catch (err) {
//     console.error("❌ Error fetching rented items:", err);
//     res.redirect("/");
//   }
// });

// app.get("/renteditems", ensureAuthenticated, async (req, res) => {
//   try {
//     // Get the current user's phone number from session
//     const userPhone = req.session.user.phone;
    
//     // Fetch rented items where the phone number matches and status is "approved"
//     const rentedItems = await Rental.find({ "renterDetails.phone": userPhone, status: "approved" })
//       .populate("itemId"); // Populate item details

//     res.render("renteditems", { user: req.session.user, rentedItems });
//   } catch (err) {
//     console.error("❌ Error fetching rented items:", err);
//     res.redirect("/");
//   }
// });
//requests
app.get("/renteditems", ensureAuthenticated, async (req, res) => {
  try {
      console.log("🛠️ Checking requests page access for user:", req.session.user);

      if (!req.session.user || !req.session.user._id) {
          console.error("❌ User not found in session!");
          return res.redirect("/login");
      }

      const userId = req.session.user._id;
      console.log("🔍 Fetching all rental requests for owner:", userId);

      const ownerRequests = await Rental.find({ ownerId: userId });

      // ✅ Log image URLs
      ownerRequests.forEach(req => console.log("🖼️ Image URL:", req.productImage));

      res.render("renteditems", { user: req.session.user, requests: ownerRequests });

  } catch (error) {
      console.error("❌ Error fetching rental requests:", error);
      res.redirect("/");
  }
});


//requests
app.get("/requests", ensureAuthenticated, async (req, res) => {
  try {
      console.log("🛠️ Checking requests page access for user:", req.session.user);

      if (!req.session.user || !req.session.user._id) {
          console.error("❌ User not found in session!");
          return res.redirect("/login");
      }

      const userId = req.session.user._id;
      console.log("🔍 Fetching all rental requests for owner:", userId);

      const ownerRequests = await Rental.find({ ownerId: userId });

      // ✅ Log image URLs
      ownerRequests.forEach(req => console.log("🖼️ Image URL:", req.productImage));

      res.render("requests", { user: req.session.user, requests: ownerRequests });

  } catch (error) {
      console.error("❌ Error fetching rental requests:", error);
      res.redirect("/");
  }
});





// 📌 Delete Item (Only if not rented)
app.post("/items/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }

    if (item.isRented) {
      return res.status(400).send("Item is currently rented and cannot be deleted.");
    }

    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/givenitems");
  } catch (err) {
    console.error(err);
    res.redirect("/givenitems");
  }
});

// 📌 Upload New Item Form
app.get("/items/upload", ensureAuthenticated, (req, res) => {
  res.render("upload");
});

// 📌 Handle New Item Upload
app.post("/items/upload", upload.single("image"), ensureAuthenticated, async (req, res) => {
  const { name, description, price, duration } = req.body;

  // ✅ Log session data
  console.log("🔍 User session data:", req.session);

  if (!req.session.user || !req.session.user._id) {
      console.log("🚨 User not authenticated.");
      return res.status(401).send("User not authenticated.");
  }

  if (!name || !description || !price || !duration || !req.file) {
      return res.status(400).send("All fields are required.");
  }

  try {
      const image = `/uploads/${req.file.filename}`;

      // ✅ Store user ID correctly
      const newItem = new Item({
          name,
          description,
          price,
          duration,
          image,
          owner: new mongoose.Types.ObjectId(req.session.user._id), // Ensure it's an ObjectId
          status: "Available",
      });

      await newItem.save();
      res.redirect("/dashboard");
  } catch (error) {
      console.error("❌ Error saving item:", error);
      res.status(500).send("Internal Server Error");
  }
});






 

// 📌 Detailed Product Page
app.get("/items/:id", ensureAuthenticated, async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render("itemDetail", { item });
});

// 📌 Rent Now Form
app.get("/rent/:id", ensureAuthenticated, async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render("rentForm", { item });
});


// 📌 Rent Item Action
app.post("/rent/:itemId", ensureAuthenticated, async (req, res) => {
  try {
      const { itemId } = req.params;
      const { fullName, phone, address, rentalDate } = req.body;
      
      if (!fullName || !phone || !address || !rentalDate) {
          return res.status(400).json({ error: "All fields are required!" });
      }

      // ✅ Fetch the item to get name & image
      const item = await Item.findById(itemId);
      if (!item) {
          return res.status(404).json({ error: "Item not found!" });
      }

      // ✅ Store rental request with product name & image
      const rentalRequest = new Rental({
          productName: item.name,
          productImage: item.image, // ✅ Store image too
          phone,
          fullName,
          address,
          rentalDate,
          ownerId: item.owner,
      });

      await rentalRequest.save();
      res.status(200).json({ message: "Rental request submitted successfully!" });

  } catch (error) {
      console.error("Rental error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});





// 📌 About Page
app.get("/aboutus", ensureAuthenticated,(req, res) => {
  res.render("aboutus");
});

//confirm
app.post("/rent/confirm", ensureAuthenticated, async (req, res) => {
  try {
    const { itemId, fullName, phone, address, rentalDate } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).send("Item not found");

    const rental = new Rental({
      itemId: itemId,
      renterDetails: { fullName, phone, address },
      rentalDate: new Date(rentalDate),
      status: "pending",
      ownerId: item.owner, // Store owner's ID
    });

    await rental.save();
    res.redirect("/dashboard"); // Redirect after submission
  } catch (err) {
    console.error("❌ Error creating rental request:", err);
    res.redirect("/");
  }
});










//approve and rejection
app.post("/requests/approve/:rentalId", async (req, res) => {
  try {
      const rentalId = req.params.rentalId;
      const rentalRequest = await Rental.findById(rentalId);

      if (!rentalRequest) {
          return res.status(404).json({ error: "Rental request not found!" });
      }

      // ✅ Log to check rental request details
      console.log("Approving rental request:", rentalRequest);

      // ✅ Find the renter using `renterId`
      const renter = await User.findById(rentalRequest.renterId);

      if (!renter) {
          console.log("❌ Renter not found for ID:", rentalRequest.renterId);
          return res.status(404).json({ error: "Renter not found!" });
      }

      // ✅ Add the rented item to the renter's list
      renter.rentedItems.push({
          productName: rentalRequest.productName,
          rentalDate: rentalRequest.rentalDate,
          address: rentalRequest.address,
          phone: rentalRequest.phone
      });

      await renter.save();

      // ✅ Remove the request after approval
      await Rental.findByIdAndDelete(rentalId);

      console.log("✅ Rental approved and added to rented items!");

      // 🔥 Send a success response (no redirect)
      res.json({ message: "Rental approved successfully" });

  } catch (error) {
      console.error("❌ Approval error:", error);
      res.status(500).json({ error: "Server error" });
  }
});



app.post("/requests/reject/:rentalId", ensureAuthenticated, async (req, res) => {
  try {
    await Rental.findByIdAndDelete(req.params.rentalId);
    res.redirect("/requests");
  } catch (err) {
    console.error("❌ Error rejecting rental:", err);
    res.redirect("/");
  }
});




// 🔹 Make the `user` available in EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 🚀 Start the Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
