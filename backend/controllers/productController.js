import Product from "../models/productModel.js";

// get all product
// GET /api/products
// Public
export const getProduct = async (req, res) => {
  try {
    const perPage = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
      .limit(perPage)
      .skip(perPage * (page - 1));
    //.sort(sortOptions);
    res.json({ products, page, pages: Math.ceil(count / perPage) });
  } catch (error) {
    res.status(404).json({ message: "Resource not Found" });
  }
};

// get top rated product
// GET /api/products/top
// Public
export const getTopProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: "Resource not Found" });
  }
};

// get single product
// GET /api/products/:id
// Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a product
// POST /api/products
// Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: "saple name",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "sample brand",
      category: "sample catagory",
      coungtInStock: 0,
      numReviews: 0,
      description: "sample desctiption",
    });
    const createdProduct = await product.save();
    res.status(200).json({ createdProduct });
  } catch (error) {
    res.status(500).json({ error: "Resource not Found" });
  }
};

// Update a product
// PUT /api/products/:id
// Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } =
      req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      console.log(product);
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      console.log(product);
      res.status(200).json(updatedProduct);
    } else res.status(404).json({ error: "No product found" });
  } catch (error) {
    res.status(404).json({ error: "Server error" });
  }
};

// Delet product
// DELETE /api/products/:id
// Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Product Deleted" });
    } else res.status(404).json({ error: "No product found" });
  } catch (error) {
    res.status(404).json({ error: "Server error" });
  }
};

// Create new review
// POST /api/products/:id/reviews
// Private
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: "Product alrady reviewed" });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else res.status(404).json({ message: "No product found" });
  } catch (error) {
    res.status(404).json({ error });
  }
};
