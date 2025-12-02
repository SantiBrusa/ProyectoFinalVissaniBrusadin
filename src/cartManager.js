import Cart from "./models/cart.model.js";

class CartManager {
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return newCart.toObject();
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async getCartById(cid) {
    try {
      const cart = await Cart.findById(cid)
        .populate("products.product")
        .lean();

      if (!cart) throw new Error("Carrito no encontrado");
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) throw new Error("Carrito no encontrado");

      const existing = cart.products.find(
        (p) => p.product.toString() === pid
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw new Error("Error al agregar producto al carrito");
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== pid
      );

      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw new Error("Error al eliminar producto");
    }
  }

  async emptyCart(cid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = [];
      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw new Error("Error al vaciar el carrito");
    }
  }
}

export default CartManager;
