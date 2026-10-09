const Product = require('../Models/Products');
const upload = require('../Middlewares/upload'); //import the upload middleware for handling file uploads
const sendEmail = require('../Middlewares/emailSender'); //import the sendEmail function from the email utility

//create a product
exports.createProduct = async (req, res) => {
  try {
      const { name, size, description, price, quantity, color } = req.body;

      const product = new Product({
        name,
        size,
        description,
        price,
        quantity,
        image: req.file ? req.file.path : undefined,
        color
      });

      const emailSubject = 'New Product Created';
      const emailText = `A new product has been created:\n\nName: ${name}\nSize: ${size}\nDescription: ${description}\nPrice: ${price}\nQuantity: ${quantity}\nColor: ${color || 'N/A'}`;
      await sendEmail("tolinsvic@gmail.com", emailSubject, emailText);

      await product.save();
      res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


//update a product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; //where id is the product id to be updated
        const { name, size, description, price, quantity, color } = req.body;

        const product = await Product.findByIdAndUpdate(id, { name, size, description, price, quantity, color }, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }   

        res.status(200).json({ message: 'Product updated successfully', product });
    }   
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }

};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product retrieved successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ message: 'Products retrieved successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }   
};
