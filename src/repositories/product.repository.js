const Product = require("../models/product.model");
const userModel = require("../models/user.model");
const { logger } = require("../middleware/logger.middleware");

class ProductRepository {
  async addProduct({ title, description, price, img, code, stock, category, thumbnail }, email) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        logger.warning("Todos los campos son obligatorios");
        return;
      }

      const productExist = await Product.findOne({ code: code });
      if (productExist) {
        logger.warning("El código ingresado pertenece a otro producto");
        return;
      }

      const emailUser = await userModel.findOne(email);
      if (!emailUser) {
        throw new Error("Vendedor no encontrado");
      }

      const newProduct = new Product({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnail,
        owner: emailUser.first_name,
      });

      await newProduct.save();
      return newProduct;
    } catch (error) {
      logger.error("Error al crear producto:", error);
      throw new Error("Error al crear producto: " + error.message);
    }
  }


  async getProducts(limit = 10, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;
      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }
      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }
      const productos = await Product.find(queryOptions).sort(sortOptions).skip(skip).limit(limit);
      const totalProducts = await Product.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      };
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }


  async updateProduct(id, productoActualizado) {
    try {
      const update = await Product.findByIdAndUpdate(id, productoActualizado);
      if (!update) {
        logger.warning("Producto no encontrado");
        return null;
      }
      logger.info("Producto actualizado");
      return update;
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const deleteProd = await Product.findByIdAndDelete(id);
      if (!deleteProd) {
        logger.warning("Producto no encontrado");
        return null;
      }
      logger.info("Producto eliminado");
      return deleteProd;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

module.exports = ProductRepository;
