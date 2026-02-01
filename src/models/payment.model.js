const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const paymentSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      enum: ["online", "cash"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    note: {
      type: String,
      trim: true,
    },

    image: {
      type: String, // store uploaded file URL/path
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.plugin(toJSON);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
