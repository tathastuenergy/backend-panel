const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const inventorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
       unique: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      // example: kg, pcs, liter, meter
    },
    hsn: {
      type: String,
      required: true,
      trim: true,
    },
    tax: {
      type: String,
      required: true,
      trim: true,
    },
    purchase:{
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// convert mongoose doc to json
inventorySchema.plugin(toJSON);

inventorySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);
/**
 * @typedef Inventory
 */
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
