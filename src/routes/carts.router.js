import Cart from "../models/cart.model.js";
import express from "express";

const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      const newCart = new Cart({
        products: [{ product: pid, quantity }]
      });
      await newCart.save();
      return res.status(201).json({ status: "success", payload: newCart });
    }

    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );

    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    );

    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default cartsRouter;
