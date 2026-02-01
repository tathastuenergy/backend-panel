// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");
// const Joi = require("joi");
// const { Payment, Customer } = require("../models");
// const { handlePagination } = require("../utils/helper");

// const createPayment = {
//   validation: {
//     body: Joi.object().keys({
//       customerId: Joi.string().required(),
//       date: Joi.date().required(),
//       paymentMode: Joi.string().valid("online", "cash").required(),
//       amount: Joi.number().min(0).required(),
//       note: Joi.string().allow("").optional(),
//       image: Joi.string().uri().allow("").optional(),
//     }),
//   },

//   handler: async (req, res) => {
//     try {
//       const { customerId } = req.body;

//       // 🔍 Check customer exists
//       const customer = await Customer.findById(customerId);
//       if (!customer) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Customer not found");
//       }

//       const baseUrl = req.protocol + "://" + req.get("host");
//       // If using multer for logo upload
//       if (req.file) {
//         req.body.image = req.file.filename;
//       }

//       const image = req.file?.filename
//         ? `${baseUrl}/uploads/${req.file.filename}`
//         : "";

//       const payment = await Payment.create({ ...req.body, image });

//       return res.status(httpStatus.CREATED).json({
//         success: true,
//         message: "Payment created successfully!",
//         data: payment,
//       });
//     } catch (error) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Failed to create payment",
//       });
//     }
//   },
// };

// const updatePayment = {
//   validation: {
//     body: Joi.object().keys({
//       customerId: Joi.string().required(),
//       date: Joi.date().required(),
//       paymentMode: Joi.string().valid("online", "cash").required(),
//       amount: Joi.number().min(0).required(),
//       note: Joi.string().allow("").optional(),
//       image: Joi.string().uri().allow("").optional(),
//     }),
//   },

//   handler: async (req, res) => {
//       try {
//         const { id } = req.params;
//       const { customerId } = req.body;

//       // 🔍 Check customer exists
//       const customer = await Customer.findById(customerId);
//       if (!customer) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Customer not found");
//       }

//       const baseUrl = req.protocol + "://" + req.get("host");
//       // If using multer for logo upload
//       if (req.file) {
//         req.body.image = `${baseUrl}/uploads/${req.file.filename}`;
//           }
          
//       const updatedPayment = await Payment.findByIdAndUpdate(
//               id,
//               { $set: req.body },
//               { new: true }
//             );
      
//             return res.status(httpStatus.OK).json({
//               success: true,
//               message: "Payment updated successfully!",
//               data: updatedPayment,
//             });
//     } catch (error) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || "Failed to update payment",
//       });
//     }
//   },
// };

// const getAllPayment = {
//   handler: async (req, res) => {
//     try {

//       const payment = await Payment.find()
//         .populate('customerId')
//         .sort({ createdAt: -1 });


//       return res.status(httpStatus.OK).json({
//         success: true,
//         message: 'Payment fetched successfully!',
//         data: payment,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to fetch payment',
//       });
//     }
//   },
// };

// // ✅ GET Payment by ID
// const getPaymentById = {
//   validation: {
//     params: Joi.object().keys({
//       id: Joi.string().required(),
//     }),
//   },

//   handler: async (req, res) => {
//     try {
//       const { id } = req.params;

//       const payment = await Payment.findById(id)
//         .populate('customerId')

//       if (!payment) {
//         throw new ApiError(
//           httpStatus.NOT_FOUND,
//           'Payment not found'
//         );
//       }

//       return res.status(httpStatus.OK).json({
//         success: true,
//         message: 'Payment fetched successfully!',
//         data: payment,
//       });
//     } catch (error) {
//       return res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || 'Failed to fetch payment',
//       });
//     }
//   },
// };

// // ✅ DELETE Payment
// const deletePayment = {
//   handler: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const payment = await Payment.findById(id);

//       if (!payment) {
//         return res.status(404).send({ message: "Payment not found" });
//       }

//       await Payment.findByIdAndDelete(id);
//       res.status(200).send({ message: "Payment deleted successfully" });
//     } catch (error) {
//       console.error(error); // log real error
//       res.status(500).send({ message: "Error deleting Payment" });
//     }
//   },
// };

// module.exports = {
//     createPayment,
//     updatePayment,
//     getAllPayment,
//     getPaymentById,
//     deletePayment
// }

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Joi = require("joi");
const { Payment, Customer, Invoice } = require("../models");

const createPayment = {
  validation: {
    body: Joi.object().keys({
      customerId: Joi.string().required(),
      invoiceId: Joi.string().required(),
      date: Joi.date().required(),
      paymentMode: Joi.string().valid("online", "cash").required(),
      amount: Joi.number().min(0).required(),
      note: Joi.string().allow("").optional(),
      image: Joi.string().uri().allow("").optional(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { customerId, invoiceId } = req.body;

      // 🔍 Check customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Customer not found");
      }

      // 🔍 Check invoice exists
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invoice not found");
      }

      // Optional: ensure invoice belongs to the customer
      if (invoice.customerId.toString() !== customerId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invoice does not belong to this customer");
      }

      const baseUrl = req.protocol + "://" + req.get("host");

      if (req.file) {
        req.body.image = req.file.filename;
      }

      const image = req.file?.filename
        ? `${baseUrl}/uploads/${req.file.filename}`
        : "";

      const payment = await Payment.create({ ...req.body, image });

      return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Payment created successfully!",
        data: payment,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to create payment",
      });
    }
  },
};

const updatePayment = {
  validation: {
    body: Joi.object().keys({
      customerId: Joi.string().required(),
      invoiceId: Joi.string().required(),
      date: Joi.date().required(),
      paymentMode: Joi.string().valid("online", "cash").required(),
      amount: Joi.number().min(0).required(),
      note: Joi.string().allow("").optional(),
      image: Joi.string().uri().allow("").optional(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const { customerId, invoiceId } = req.body;

      // 🔍 Check customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Customer not found");
      }

      // 🔍 Check invoice exists
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invoice not found");
      }

      // Optional: ensure invoice belongs to the customer
      if (invoice.customerId.toString() !== customerId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invoice does not belong to this customer");
      }

      const baseUrl = req.protocol + "://" + req.get("host");

      if (req.file) {
        req.body.image = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedPayment = await Payment.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Payment updated successfully!",
        data: updatedPayment,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update payment",
      });
    }
  },
};

const getAllPayment = {
  handler: async (req, res) => {
    try {
      const payment = await Payment.find()
        .populate("customerId")
        .populate("invoiceId")
        .sort({ createdAt: -1 });

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Payment fetched successfully!",
        data: payment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payment",
      });
    }
  },
};

const getPaymentById = {
  validation: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findById(id)
        .populate("customerId")
        .populate("invoiceId");

      if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
      }

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Payment fetched successfully!",
        data: payment,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to fetch payment",
      });
    }
  },
};

const deletePayment = {
  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).send({ message: "Payment not found" });
      }

      await Payment.findByIdAndDelete(id);
      res.status(200).send({ message: "Payment deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error deleting Payment" });
    }
  },
};

module.exports = {
  createPayment,
  updatePayment,
  getAllPayment,
  getPaymentById,
  deletePayment,
};
