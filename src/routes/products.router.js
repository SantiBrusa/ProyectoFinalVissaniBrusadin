import express from "express";
import Product from "../models/product.model.js";
// import uploader from "../utils/uploader.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const data = await Product.paginate({}, { limit, page });
    const products = data.docs;
    delete data.docs;

    res.status(200).json({ status: "success", payload: products, ...data });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al recuperar los productos" });
  }
});

productsRouter.post(
  "/",
  /*uploader.single("thumbnail"),*/ async (req, res) => {
    try {
      const newProduct = req.body;

      // const { title, price, description, category, stock, code } = req.body;
      // let thumbnail = null;
      // if (req.file) {
      //   thumbnail = "/img/" + req.file.filename;
      // }

      // const newProduct = {
      //   title,
      //   description,
      //   code,
      //   category,
      //   price,
      //   stock,
      //   thumbnail,
      // };

      const product = new Product(newProduct);

      await product.save();

      res.status(201).json({ status: "success", payload: product });
      // res.redirect("/");
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error al agregar los productos" });
    }
  }
);

productsRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const updateProducts = await Product.findByIdAndUpdate(pid, updates, {
      new: true,
      runValidators: true,
    });

    if (!updateProducts)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ status: "success", payload: updateProducts });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar el producto" });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (!deletedProduct)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar el producto" });
  }
});

export default productsRouter;
