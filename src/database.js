const moongose = require("mongoose");
const configObject = require("./config/env.config");
const { logger } = require("./middleware/logger.middleware");

class DataBase {
  static #instance;
  constructor() {
    moongose.connect(configObject.server.mongo_url);
  }

  static getInstance() {
    try {
      if (this.#instance) return this.#instance;
      this.#instance = new DataBase();
      logger.info("mongoDB connected succesfully");
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = DataBase.getInstance();
