const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  value: { type: Number, default: 0 },
});

/**
 * @typedef Counter
 */
const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
