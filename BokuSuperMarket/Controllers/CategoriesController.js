const Categories = require('../Models/Categories')

//create a category
exports.createCategory = async (req, res) => {
    try {
        //check if all required fields are provided
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        //create a new category
        const category = new Categories({
            name: req.body.name,
            description: req.body.description,
            IsAvailable: req.body.IsAvailable,
            image: req.body.image,
            products: req.body.products // Accept products as an array of product IDs
        });

        //save the category to the database
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.find().populate('products');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id).populate('products');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Categories.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.deleteCategory = async (req, res) => {  
    try {
        const category = await Categories.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProductToCategory = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.products.push(req.params.productId);
        await category.save();
        res.status(200).json({ message: 'Product added to category successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeProductFromCategory = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.products.pull(req.params.productId);
        await category.save();
        res.status(200).json({ message: 'Product removed from category successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};


exports.getProductsByCategory = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.categoryId).populate('products');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category.products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.getCategoryByProductId = async (req, res) => {
    try {
        const category = await Categories.findOne({ products: req.params.productId }).populate('products');
        if (!category) {
            return res.status(404).json({ message: 'Category not found for this product' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAvailableCategories = async (req, res) => {
    try {
        const categories = await Categories.find({ IsAvailable: true }).populate('products');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.getUnavailableCategories = async (req, res) => {
    try {
        const categories = await Categories.find({ IsAvailable: false }).populate('products');
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.deleteAllCategories = async (req, res) => {
    try {
        await Categories.deleteMany({});
        res.status(200).json({ message: 'All categories deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
