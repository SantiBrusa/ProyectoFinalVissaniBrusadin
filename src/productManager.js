import Product from "./models/product.model.js";

class ProductManager {
  async getProducts({ limit = 10, page = 1 } = {}) {
    try {
      const options = {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
        lean: true,
      };

      return await Product.paginate({}, options);
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto");
    }
  }

  async addProduct(data) {
    try {
      const { title, description, code, price, stock, category, thumbnail } =
        data;

      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error("Faltan campos obligatorios");
      }

      const exists = await Product.findOne({ code });
      if (exists) throw new Error("El código ya existe");

      const newProduct = await Product.create({
        title,
        description,
        code,
        price: Number(price),
        stock: Number(stock),
        category,
        thumbnail: thumbnail || "",
      });

      return newProduct.toObject();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, updates) {
    try {
      const updated = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        lean: true,
      });

      if (!updated) throw new Error("Producto no encontrado");
      return updated;
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await Product.findByIdAndDelete(id).lean();
      if (!deleted) throw new Error("Producto no encontrado");
      return deleted;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

export default ProductManager;