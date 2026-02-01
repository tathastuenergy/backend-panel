const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { companyController } = require('../../controllers');
const imageUpload = require('../../middlewares/imageUpload');

const router = express.Router();

router.post('/create',imageUpload.single("company_logo"), validate(companyController.createCompany.validation), catchAsync(companyController.createCompany.handler));
router.put(
  "/update/:id",
  imageUpload.single("company_logo"),
  validate(companyController.updateCompany.validation),
  catchAsync(companyController.updateCompany.handler)
);
router.get('/getall', catchAsync(companyController.getAllCompany.handler));
router.get('/getById/:_id', catchAsync(companyController.getCompanyById.handler));
router.delete('/delete/:id', catchAsync(companyController.deleteCompany.handler));

module.exports = router;