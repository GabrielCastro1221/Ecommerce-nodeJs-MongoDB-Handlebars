const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository");
const product = new ProductRepository();
const { logger } = require("../middleware/logger.middleware"); 
const MessageManager = require("../controllers/message.controller");
const Message = new MessageManager()

class SocketProductManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      logger.info("Usuario conectado");
      socket.emit("products", await product.getProducts());

      socket.on("deleteProd", async (id) => {
        await product.deleteProduct(id);
        this.emitUpdatedProducts(socket);
      });

      socket.on("addProd", async (producto) => {
        await product.addProduct(producto);
        this.emitUpdatedProducts(socket);
      });

      socket.on("mensaje", async (info) => {
        await Message.createMessage(info);
        this.io.emit("chat", await Message.getMessages());
      });

      socket.on("clearchat", async () => {
        await Message.deleteAllMessages();
      });
    });
  }

  async emitUpdatedProducts(socket) {
    socket.emit("products", await product.getProducts());
  }
}

module.exports = SocketProductManager;
