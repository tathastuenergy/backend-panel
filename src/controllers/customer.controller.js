const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Joi = require("joi");
const { Customer, Company, Invoice, Payment } = require("../models");
const { handlePagination } = require("../utils/helper");
const transporter = require("../config/email");

const createCustomer = {
  validation: {
    body: Joi.object().keys({
      name: Joi.string().trim().required(),
      mobile: Joi.string().trim().required(),
      email: Joi.string().allow("", null),
      gst_number: Joi.string().allow("", null),
      address: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      pincode: Joi.string().trim().required(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { mobile, gst_number } = req.body;

      // 🔍 Check mobile already exists
      const mobileExist = await Customer.findOne({ mobile });
      if (mobileExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Mobile number already exists",
        );
      }

      // 🔍 Check GST number already exists (if provided)
      if (gst_number) {
        const gstExist = await Customer.findOne({ gst_number });
        if (gstExist) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "GST number already exists",
          );
        }
      }

      const customer = await Customer.create(req.body);

      return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Customer created successfully!",
        data: customer,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to create customer",
      });
    }
  },
};

const getAllCustomer = {
  handler: async (req, res) => {
    const { status, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    await handlePagination(Customer, req, res, query);
  },
};

const getCustomerById = {
  handler: async (req, res) => {
    try {
      const { _id } = req.params;

      // 🔍 Find blog by MongoDB ID
      const pre_recorded = await Customer.findById(_id);

      if (!pre_recorded) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.status(200).json(pre_recorded);
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

const updateCustomer = {
  validation: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().trim().required(),
      mobile: Joi.string().trim().required(),
      email: Joi.string().email().allow(null, ""),
      gst_number: Joi.string().allow("", null),
      address: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      pincode: Joi.string().trim().required(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const { mobile, gst_number } = req.body;

      // 🔍 Check customer exists
      const customer = await Customer.findById(id);
      if (!customer) {
        throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
      }

      // 🔍 Mobile duplicate check (exclude current customer)
      const mobileExist = await Customer.findOne({
        mobile,
        _id: { $ne: id },
      });
      if (mobileExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Mobile number already exists",
        );
      }

      // 🔍 GST duplicate check (exclude current customer)
      if (gst_number) {
        const gstExist = await Customer.findOne({
          gst_number,
          _id: { $ne: id },
        });
        if (gstExist) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "GST number already exists",
          );
        }
      }

      // ✅ Update customer
      const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Customer updated successfully!",
        data: updatedCustomer,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update customer",
      });
    }
  },
};

const deleteCustomer = {
  handler: async (req, res) => {
    const { _id } = req.params;

    const questionExist = await Customer.findOne({ _id });

    if (!questionExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Customer not exist");
    }

    await Customer.findByIdAndDelete(_id);

    res.send({ message: "Customer deleted successfully" });
  },
};

// const getCustomerStatement = async (req, res) => {
//   const { id } = req.params;

//   const customer = await Customer.findById(id);
//   if (!customer) {
//     return res.status(404).json({ message: 'Customer not found' });
//   }

//   const company = await Company.findOne();

//   const customerId = id
//   const invoices = await Invoice.find({ customerId }).sort({ date: 1 });
//   const payments = await Payment.find({ customerId }).sort({ date: 1 });

//   let transactions = [];

//   invoices.forEach(inv => {
//     transactions.push({
//       date: inv.date,
//       transaction: 'Invoice',
//             notes: `${inv.invoiceNo} - due on ${inv.date?.toLocaleDateString('en-GB')}${inv.orderNo ? ` | Order - ${inv.orderNo}` : ''}`,
//       amount: inv.grandTotal,
//       payment: 0,
//       invoiceId: inv.id,
//     });
//   });

//   payments.forEach(pay => {
//     transactions.push({
//       date: pay.date,
//       transaction: 'Payment Received',
//       notes: pay.note,
//       amount: 0,
//       payment: pay.amount,
//     });
//   });

//   // Date wise sort
//   transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

//   // Running balance
//   let balance = 0;
//   transactions = transactions.map(t => {
//     balance = balance + t.amount - t.payment;
//     return { ...t, balance };
//   });

//   res.json({
//     company,
//     customer,
//     openingBalance: 0,
//     transactions,
//   });
// };

// const getCustomerStatement = async (req, res) => {
//   const { id } = req.params;

//   const customer = await Customer.findById(id);
//   if (!customer) {
//     return res.status(404).json({ message: 'Customer not found' });
//   }

//   const company = await Company.findOne();

//   const invoices = await Invoice.find({ customerId: id }).sort({ date: 1 });
//   const payments = await Payment.find({ customerId: id }).sort({ date: 1 });

//   let transactions = [];
//   let balance = 0;

//   for (const inv of invoices) {
//     // 🔹 Add invoice to transactions
//     console.log('inv.grandTotal', inv.grandTotal)
//     balance += inv.grandTotal;

//     transactions.push({
//       date: inv.date,
//       transaction: 'Invoice',
//       notes: `${inv.invoiceNo}${inv.orderNo ? ` | Order - ${inv.orderNo}` : ''} - due on ${inv.date?.toLocaleDateString('en-GB')}`,
//       amount: inv.grandTotal,
//       payment: 0,
//       balance,
//     });

//     // 🔹 Add payments linked to this invoice
//     const invoicePayments = payments.filter(
//       (p) => p.invoiceId?.toString() === inv.id.toString()
//     );

//     for (const pay of invoicePayments) {
//       balance -= pay.amount;

//       transactions.push({
//         date: pay.date,
//         transaction: 'Payment Received',
//         notes: `₹${pay.amount} received for ${inv.invoiceNo}`,
//         amount: 0,
//         payment: pay.amount,
//         balance,
//       });
//     }
//   }

//   // 🔹 Add any standalone payments not linked to any invoice
//   const standalonePayments = payments.filter(
//     (p) => !p.invoiceId
//   );

//   for (const pay of standalonePayments) {
//     balance -= pay.amount;

//     transactions.push({
//       date: pay.date,
//       transaction: 'Payment Received',
//       notes: `₹${pay.amount} received (No Invoice)`,
//       amount: 0,
//       payment: pay.amount,
//       balance,
//     });
//   }

//   // Sort all transactions by date
//   transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

//   res.json({
//     company,
//     customer,
//     openingBalance: 0,
//     transactions,
//   });
// };

const getCustomerStatement = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query; // Get filters from frontend

  const customer = await Customer.findById(id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  const company = await Company.findOne();

  // Define Date Filter Object
  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.date = { 
      $gte: new Date(startDate), 
      $lte: new Date(endDate) 
    };
  }

  // 1. Calculate Opening Balance (Sum of all transactions BEFORE startDate)
  let openingBalance = 0;
  if (startDate) {
    const prevInvoices = await Invoice.find({ 
      customerId: id, 
      date: { $lt: new Date(startDate) } 
    });
    const prevPayments = await Payment.find({ 
      customerId: id, 
      date: { $lt: new Date(startDate) } 
    });

    const totalPrevInv = prevInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPrevPay = prevPayments.reduce((sum, pay) => sum + pay.amount, 0);
    openingBalance = totalPrevInv - totalPrevPay;
  }

  // 2. Fetch Invoices and Payments within range
  const invoices = await Invoice.find({ customerId: id, ...dateFilter });
  const payments = await Payment.find({ customerId: id, ...dateFilter })
    .populate("invoiceId")
    .sort({ date: 1 });

  let transactions = [];

  // Process Invoices
  invoices.forEach((inv) => {
    transactions.push({
      date: inv.date,
      type: "Invoice",
      notes: `${inv.invoiceNo} due on ${inv.date?.toLocaleDateString("en-GB")}`,
      amount: inv.grandTotal,
      payment: 0,
    });
  });

  // Process Payments
  payments.forEach((pay) => {
    const invNo = pay.invoiceId ? pay.invoiceId.invoiceNo : "N/A";
    transactions.push({
      date: pay.date,
      transaction: "Payment Received",
      notes: `${pay.amount} for payment of ${invNo}`,
      amount: 0,
      payment: pay.amount,
    });
  });

  // Sort by date
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 3. Calculate Running Balance starting from Opening Balance
  let runningBalance = openingBalance;
  let periodInvoiced = 0;
  let periodPaid = 0;

  const finalTransactions = transactions.map((t) => {
    periodInvoiced += t.amount;
    periodPaid += t.payment;
    runningBalance += t.amount - t.payment;

    return {
      ...t,
      balance: runningBalance,
    };
  });

  res.json({
    company,
    customer,
    summary: {
      openingBalance: openingBalance,
      invoicedAmount: periodInvoiced,
      amountPaid: periodPaid,
      balanceDue: runningBalance,
    },
    transactions: finalTransactions,
  });
};

const sendStatementEmail = async (req, res) => {
  try {
    const { email, customerName, company_name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file missing" });
    }

    await transporter.sendMail({
      from: `"${company_name}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Statement of Account",
      html: `
        <p>Dear <b>${customerName}</b>,</p>
        <p>Please find attached your statement of account.</p>
        <p>Regards,<br/>${company_name}</p>
      `,
      attachments: [
        {
          filename: "statement.pdf",
          content: req.file.buffer,
          contentType: "application/pdf",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};
module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerStatement,
  sendStatementEmail
};
