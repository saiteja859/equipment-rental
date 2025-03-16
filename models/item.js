const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }, // ✅ Added description
    image: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Ensure it's an ObjectId
    status: { type: String, default: "Available" }, // Track availability
    renter: {
        fullName: String,
        phone: String,
        address: String,
        rentalDate: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
});

module.exports = mongoose.model("Item", ItemSchema);
