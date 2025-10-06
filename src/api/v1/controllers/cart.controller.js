const Cart = require("../models/Cart.model");

async function getCart(req, res) {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate(
      "products.product"
    );
    return res.status(200).json({
      data: cart[0] ?? {
        products: [],
        user: req.user._id,
      },
      message: "Cart fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function createCart(req, res) {
  try {
    const { product, quantity, discount } = req.body;
    const cart = await Cart.create({
      user: req.user._id,
      products: [{ product, quantity, discount, updatedOn: new Date() }],
    });
    res.status(201).json({ data: cart, message: "Cart created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function addProductToCart(req, res) {
  try {
    const { product, quantity, discount } = req.body;
    // validate the user is the owner of the cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      // create a new cart
      return await createCart(req, res);
    }
    if (cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $push: {
          products: { product, quantity, discount, updatedOn: new Date() },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Product added to cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function updateProductInCart(req, res) {
  try {
    const { id } = req.params;
    const { quantity, discount } = req.body;
    // validate the user is the owner of the cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    if (cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the specific product in the array using positional operator
    const updatedCart = await Cart.findOneAndUpdate(
      { user: req.user._id, "products._id": id },
      {
        $set: {
          "products.$.quantity": quantity,
          "products.$.discount": discount,
          "products.$.updatedOn": new Date(),
        },
      },
      { new: true }
    ).populate("products.product");

    if (!updatedCart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    return res.status(200).json({
      message: "Product updated in cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function removeProductFromCart(req, res) {
  try {
    const { id } = req.params;
    // validate the user is the owner of the cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    if (cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $pull: { products: { _id: id } },
      },
      { new: true }
    ).populate("products.product");
    return res.status(200).json({
      message: "Product removed from cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = {
  createCart,
  getCart,
  addProductToCart,
  updateProductInCart,
  removeProductFromCart,
};
