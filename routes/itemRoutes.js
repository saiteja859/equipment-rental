const express = require("express");
const router = express.Router();
const Item = require("../models/item");

router.post("/upload", async (req, res) => {
  const { name, description, price, availableDates } = req.body;
  const item = new Item({
    name,
    description,
    price,
    availableDates,
    owner: req.user._id,
  });

  await item.save();
  res.redirect("/dashboard");
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id).populate("owner");
  res.render("itemDetail", { item });
});

module.exports = router;
