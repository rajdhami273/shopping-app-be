const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled", "failed"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    products: {
      type: [
        {
          product: mongoose.Schema.Types.ObjectId,
          quantity: Number,
          price: Number,
          status: String, // pending, fulfilled, cancelled, failed
        },
      ],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
