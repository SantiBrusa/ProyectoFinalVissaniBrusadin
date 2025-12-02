import express from "express";
import Product from "../models/product.model.js";
import uploader from "../utils/uploader.js";
import ProductManager from "../productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  try {
    const data = await productManager.getProducts(req.query);
    const products = data.docs;
    delete data.docs;

    res.json({ status: "success", payload: products, ...data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al recuperar los productos" });
  }
});

productsRouter.post("/", uploader.single("thumbnail"), async (req, res) => {
  try {
    const thumbnail = req.file ? `/img/${req.file.filename}` : null;

    const product = await productManager.addProduct({
      ...req.body,
      thumbnail,
    });

    const io = req.app.get("io");
    io.emit("productsUpdated");

    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    res.json({ status: "success", payload: updated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(req.params.pid);

    const io = req.app.get("io");
    io.emit("productsUpdated");

    res.json({ status: "success", payload: deleted });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default productsRouter;