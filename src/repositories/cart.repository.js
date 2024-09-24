const Cart = require("../models/cart.model");
const { logger } = require("../middleware/logger.middleware");

class CartRepository {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear carrito");
    }
  }

  async obtenerProductosDeCarrito(idCarrito) {
    try {
      const cart = await Cart.findById(idCarrito);
      if (!cart) {
        logger.warning("El carrito no existe");
        return null;
      }
      return cart;
    } catch (error) {
      throw new Error("Error al obtener los productos del carrito");
    }
  }

  async addProductInCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.obtenerProductosDeCarrito(cartId);
      const productExists = cart.products.find(
        (item) => item.product._id.toString() === productId
      );
      if (productExists) {
        productExists.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar productos al carrito");
    }
  }

  async deleteProductInCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al eliminar el producto del carrito");
    }
  }

  async updateProductInCart(cartId, updatedProducts) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = updatedProducts;
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar producto en el carrito");
    }
  }

  async UpdateQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productIndex = cart.products.findIndex(
        (item) => item._id.toString() === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      throw new Error("Error al actualizar el stock del producto en el carrito");
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw new Error("Error al vaciar el carrito");
    }
  }
}

module.exports = CartRepository;
