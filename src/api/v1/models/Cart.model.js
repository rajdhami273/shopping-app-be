const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [
        {
          discount: Number, // discount percentage
          product: mongoose.Schema.Types.ObjectId,
          quantity: Number,
          addedOn: Date,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
