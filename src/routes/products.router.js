const express = require("express");
const checkUserRole = require("../middleware/checkrole");
const ProductController = require("../controllers/product.controller");

const router = express.Router();
const product = new ProductController();

router.post("/", checkUserRole(["admin", "premium"]), product.addProduct);

router.get("/", checkUserRole(["usuario", "premium"]), product.getProducts);
router.get("/:pid", checkUserRole(["usuario", "premium"]), product.getProductById);

router.put("/:pid", checkUserRole(["admin", "premium"]), product.updateProduct);

router.delete("/:pid", checkUserRole(["admin", "premium"]), product.deleteProduct);

module.exports = router;
