const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Joi = require("joi");
const { Company } = require("../models");
const { handlePagination } = require("../utils/helper");

const createCompany = {
  validation: {
    body: Joi.object().keys({
      company_name: Joi.string().trim().required(),
      company_logo: Joi.string().allow("", null),
      gst_number: Joi.string().allow("", null),
      address: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      pincode: Joi.string().trim().required(),
      website: Joi.string().allow("", null),
      phone_number: Joi.string().trim().required(),
      email: Joi.string().email().allow("", null),
      bank_details: Joi.alternatives()
        .try(
          Joi.object({
            account_name: Joi.string().allow("", null),
            account_number: Joi.string().allow("", null),
            bank_name: Joi.string().allow("", null),
            ifsc_code: Joi.string().allow("", null),
            branch: Joi.string().allow("", null),
          }),
          Joi.string() // allow JSON string from FormData
        )
        .optional(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { gst_number, phone_number } = req.body;

      // 🔍 Check phone number already exists
      const phoneExist = await Company.findOne({ phone_number });
      if (phoneExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Phone number already exists"
        );
      }

      // 🔍 Check GST number already exists (if provided)
      if (gst_number) {
        const gstExist = await Company.findOne({ gst_number });
        if (gstExist) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "GST number already exists"
          );
        }
      }

      const baseUrl = req.protocol + "://" + req.get("host");
      // If using multer for logo upload
      if (req.file) {
        req.body.company_logo = req.file.filename;
      }

      const company_logo = req.file?.filename
        ? `${baseUrl}/uploads/${req.file.filename}`
        : "";

      const company = await Company.create({ ...req.body, company_logo });

      return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Company created successfully!",
        data: company,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to create company",
      });
    }
  },
};

const updateCompany = {
  validation: {
    body: Joi.object().keys({
      company_name: Joi.string().trim().required(),
      gst_number: Joi.string().allow("", null),
      address: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      pincode: Joi.string().trim().required(),
      website: Joi.string().allow("", null),
      phone_number: Joi.string().trim().required(),
      email: Joi.string().email().allow("", null),
      bank_details: Joi.alternatives()
        .try(
          Joi.object({
            account_name: Joi.string().allow("", null),
            account_number: Joi.string().allow("", null),
            bank_name: Joi.string().allow("", null),
            ifsc_code: Joi.string().allow("", null),
            branch: Joi.string().allow("", null),
          }),
          Joi.string() // allow JSON string from FormData
        )
        .optional(),
    }),
  },

  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const { gst_number, phone_number } = req.body;

      const company = await Company.findById(id);
      if (!company) {
        throw new ApiError(httpStatus.NOT_FOUND, "Company not found");
      }

      // 🔍 Check phone number already exists (exclude current company)
      const phoneExist = await Company.findOne({
        phone_number,
        _id: { $ne: id },
      });
      if (phoneExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Phone number already exists"
        );
      }

      // 🔍 Check GST number already exists (exclude current company)
      if (gst_number) {
        const gstExist = await Company.findOne({
          gst_number,
          _id: { $ne: id },
        });
        if (gstExist) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "GST number already exists"
          );
        }
      }

      const baseUrl = req.protocol + "://" + req.get("host");

      // If new logo uploaded, update it
      if (req.file) {
        req.body.company_logo = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Company updated successfully!",
        data: updatedCompany,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update company",
      });
    }
  },
};

const getAllCompany = {
  handler: async (req, res) => {
    const { status, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    await handlePagination(Company, req, res, query);
  },
};

const getCompanyById = {
  handler: async (req, res) => {
    try {
      const { _id } = req.params;

      // 🔍 Find company by MongoDB ID
      const companys = await Company.findById(_id);

      if (!companys) throw new ApiError(404, "Company not found");

      res.status(200).json({ success: true, data: companys });
    } catch (error) {
      console.error("Error fetching company by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

const deleteCompany = {
  handler: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await Company.findById(id);

      if (!company) {
        return res.status(404).send({ message: "Company not found" });
      }

      await Company.findByIdAndDelete(id);
      res.status(200).send({ message: "Company deleted successfully" });
    } catch (error) {
      console.error(error); // log real error
      res.status(500).send({ message: "Error deleting company" });
    }
  },
};

module.exports = {
  createCompany,
  updateCompany,
  getAllCompany,
  getCompanyById,
  deleteCompany,
};
