const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productImage: { type: String , required: true}, // ✅ Add this field to store image
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    rentalDate: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Rental", RentalSchema);
