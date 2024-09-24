const messageModel = require("../models/message.model");
const { logger } = require("../middleware/logger.middleware");

class MessageManager {
    getMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            return error;
        }
    }

    createMessage = async (message) => {
        if (message.message.trim() === '') {
            return null;
        }
        try {
            return await messageModel.create(message);
        } catch (error) {
            return error;
        }
    }

    deleteAllMessages = async () => {
        try {
            logger.info("Borrando Mensajes...");
            const result = await messageModel.deleteMany({});
            logger.info("Mensajes Borrados:", result);
            return result;
        } catch (error) {
            logger.error("Error al borrar mensajes:", error);
            return error;
        }
    }
}

module.exports = MessageManager;