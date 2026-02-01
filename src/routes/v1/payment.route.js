const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { PaymentController } = require('../../controllers');
const imageUpload = require('../../middlewares/imageUpload');

const router = express.Router();

router.post('/create',imageUpload.single("image"), validate(PaymentController.createPayment.validation), catchAsync(PaymentController.createPayment.handler));
router.put(
  "/update/:id",
  imageUpload.single("image"),
  validate(PaymentController.updatePayment.validation),
  catchAsync(PaymentController.updatePayment.handler)
);
router.get('/getall', catchAsync(PaymentController.getAllPayment.handler));
router.get('/getById/:id', catchAsync(PaymentController.getPaymentById.handler));
router.delete('/delete/:id', catchAsync(PaymentController.deletePayment.handler));

module.exports = router;