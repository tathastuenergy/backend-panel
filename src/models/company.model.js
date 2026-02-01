const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const companySchema = mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    company_logo: {
      type: String, // store logo URL or file path
      trim: true,
    },
    gst_number: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
     // 🔽 Bank Details
    bank_details: {
      account_name: {
        type: String,
        trim: true,
      },
      account_number: {
        type: String,
        trim: true,
      },
      bank_name: {
        type: String,
        trim: true,
      },
      ifsc_code: {
        type: String,
        trim: true,
      },
      branch: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
companySchema.plugin(toJSON);

/**
 * @typedef Company
 */
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
