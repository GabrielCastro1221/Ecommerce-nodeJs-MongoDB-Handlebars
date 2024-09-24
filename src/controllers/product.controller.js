const ProductRepository = require("../repositories/product.repository");
const Product = require("../models/product.model");

const productR = new ProductRepository();

class ProductController {
  async addProduct(req, res) {
    const newProd = req.body;
    try {
      const prod = await productR.addProduct(newProd);
      res.status(200).json(prod);
    } catch (error) {
      res.status(500).send("Error al crear producto");
    }
  }

  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
      const prods = await productR.getProducts(limit, page, sort, query);
      res.status(200).json(prods);
    } catch (error) {
      res.status(500).send("Error al obtener productos");
    }
  }

  async getProductById(req, res) {
    const prodId = req.params.pid;
    try {
      const product = await Product.findById(prodId);
      res.status(200).json({ producto: product });
    } catch {
      res.status(500).send("Error al obtener producto");
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productUpdate = req.body;
      const prod = await productR.updateProduct(id, productUpdate);
      res.status(200).json({ prod });
    } catch (error) {
      res.status(500).send("Error al actualizar el producto");
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      let prod = await productR.deleteProduct(id);
      res.status(200).json(prod);
    } catch (error) {
      res.status(500).send("Error al eliminar el producto");
    }
  }
}

module.exports = ProductController;
