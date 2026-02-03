const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const customerRoute = require('./customer.route');
const contactusRoute = require('./contactus.route')
const estimateRoute = require('./estimate.route')
const inventoryRoute = require('./inventory.route')
const invoiceRoute = require('./invoice.route');
const companyRoute = require('./company.route');
const paymentRoute = require('./payment.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/customer',
    route: customerRoute,
  },
  {
    path: '/inventory',
    route: inventoryRoute,
  },
  {
    path: '/invoice',
    route: invoiceRoute,
  },
  {
    path: '/contactus',
    route: contactusRoute
  },
  {
    path: '/estimate',
    route: estimateRoute
  },
  {
    path: '/company',
    route: companyRoute
  },
  {
    path: '/payment',
    route: paymentRoute
  }
];

defaultRoutes.forEach((route) => {
  if (!route.route) {
    throw new Error(`❌ Route is undefined for path: ${route.path}`);
  }
  router.use(route.path, route.route);
});


module.exports = router;
