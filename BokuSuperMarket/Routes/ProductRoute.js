const express = require('express');
const router = express.Router(); //
const upload = require('../Middlewares/upload'); //import the upload middleware for handling file uploads
const protect = require('../Middlewares/auth'); //import the authenticateToken middleware
const {authorize} = require('../Middlewares/role'); //import the authorize middleware
//import the product controller
const productController = require('../Controllers/ProductController');

//define the routes
router.post('/createproduct', protect,  upload.single('image'), authorize(['storekeeper','superadmin']), productController.createProduct);

router.put('/updateproduct/:id', protect, authorize(['superadmin']), productController.updateProduct);
router.get('/getproductbyid/:id', productController.getProductById);
router.get('/getallproducts', productController.getAllProducts);

//export the router to be used in other files
module.exports = router;
