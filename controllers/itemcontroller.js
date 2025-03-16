const Item = require("../models/item");

exports.bookItem = async (req, res) => {
  const item = await Item.findById(req.params.id);

  const requestedDates = req.body.dates;
  const isAlreadyBooked = item.bookedDates.some((date) =>
    requestedDates.includes(date)
  );

  if (isAlreadyBooked) {
    return res.status(400).send("This item is already booked for the selected dates.");
  }

  item.bookedDates.push(...requestedDates);
  await item.save();
  res.redirect("/dashboard");
};
