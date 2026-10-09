const express = require('express');
const router = express.Router(); //

const CategoriesController = require('../Controllers/CategoriesController');

//define the routes
router.post('/createcategory', CategoriesController.createCategory);
router.post('/addproducttocategory/:categoryId/:productId', CategoriesController.addProductToCategory);
router.put('/updatecategory/:id', CategoriesController.updateCategory);

router.get('/getavailablecategories', CategoriesController.getAvailableCategories);
router.get('/getproductsbycategory/:categoryId', CategoriesController.getProductsByCategory);
router.get('/getcategorybyid/:id', CategoriesController.getCategoryById);
router.get('/getallcategories', CategoriesController.getAllCategories);
router.get("/getcategorybyproduct/:productId", CategoriesController.getCategoryByProductId);
router.get('/getunavailablecategories', CategoriesController.getUnavailableCategories);


router.delete('/deletecategory/:id', CategoriesController.deleteCategory);
router.delete('/removeproductfromcategory/:categoryId/:productId', CategoriesController.removeProductFromCategory);
router.delete('/deleteallcategories', CategoriesController.deleteAllCategories);

//export the router to be used in other files
module.exports = router;

