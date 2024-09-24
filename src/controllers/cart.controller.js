const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const CartRepository = require("../repositories/cart.repository");
const EmailManager = require("../services/mailer/mailer");
const DTO = require("../dto/user.dto");
const { ticketNumberRandom, totalPurchase } = require("../utils/cartutils");
const { logger } = require("../middleware/logger.middleware");

const cartR = new CartRepository();
const mailer = new EmailManager();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartR.createCart();
      res.status(200).json(newCart);
    } catch (error) {
      res.status(500).send("Error al crear carrito");
    }
  }

  async getProductsToCart(req, res) {
    const cartId = req.params.cid;
    try {
      const products = await cartR.obtenerProductosDeCarrito(cartId);
      if (!products) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send("Error al obtener productos del carrito");
    }
  }

  async addProductsToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      await cartR.addProductInCart(cartId, productId, quantity);
      const idCart = req.user.cart.toString();
      res.redirect(`/carts/${idCart}`);
    } catch (error) {
      res.status(500).send("Error al agregar productos al carrito");
    }
  }

  async deleteProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const updatedCart = await cartR.deleteProductInCart(cartId, productId);
      res.status(200).json({ "Producto eliminado del carrito": updatedCart });
    } catch (error) {
      res.status(500).send("Error al eliminar producto del carrito");
    }
  }

  async updateProductsToCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartR.UpdateQuantity(cartId, updatedProducts);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).send("Error al actualizar productos en el carrito");
    }
  }

  async updateQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const updatedCart = await cartR.UpdateQuantity(cartId, productId, newQuantity);
      res.status(200).json({ "Stock actualizado": updatedCart });
    } catch (error) {
      res.status(500).send("Error al actualizar el stock del carrito");
    }
  }

  async emptyCart(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartR.emptyCart(cartId);
      res.status(200).json({ "Carrito vacio": updatedCart });
    } catch (error) {
      res.status(500).send("Error al vaciar carrito");
    }
  }

  async finishPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      const dto = new DTO(
        req.user.first_name,
        req.user.last_name,
        req.user.email,
        req.user.role
      );

      const isAdmin = req.user.role === "admin";
      const isUser = req.user.role === "usuario";
      const isPremium = req.user.role === "premium";

      const cart = await cartR.obtenerProductosDeCarrito(cartId);
      const userWithCart = await User.findOne({ cart: cartId });
      const date = new Date();

      const ticket = new Ticket({
        code: ticketNumberRandom(),
        amount: totalPurchase(cart.products),
        purchaser: userWithCart._id,
        purchase_datetime: date
      });

      await ticket.save();
      await mailer.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);
      await cartR.emptyCart(cartId);
      res.render("Ticket", { ticket, email: userWithCart.email, user: dto, isAdmin, isUser, isPremium });
    } catch (error) {
      logger.error("Error al realizar compra, intenta nuevamente");
      res.status(500).json({ error: "Error al comprar productos" });
    }
  }
}

module.exports = CartController;
