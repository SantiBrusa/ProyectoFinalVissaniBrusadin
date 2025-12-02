import express from "express";
import CartManager from "../cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager();

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartManager.emptyCart(req.params.cid);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default cartsRouter;
