const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "net_banking", "upi"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
