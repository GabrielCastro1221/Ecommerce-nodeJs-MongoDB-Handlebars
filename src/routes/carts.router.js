const express = require("express");
const checkUserRole = require("../middleware/checkrole");
const CartController = require("../controllers/cart.controller");

const router = express.Router();
const cart = new CartController();

router.post("/", cart.createCart);
router.post("/:cid/product/:pid", checkUserRole(["usuario", "premium"]), cart.addProductsToCart);
router.post("/:cid/purchase", checkUserRole(["usuario", "premium"]), cart.finishPurchase);

router.get("/:cid", checkUserRole(["usuario", "premium"]), cart.getProductsToCart);

router.put("/:cid", checkUserRole(["usuario", "premium"]), cart.updateProductsToCart);
router.put("/:cid/product/:pid", checkUserRole(["usuario", "premium"]), cart.updateQuantity);

router.delete("/:cid", checkUserRole(["usuario", "premium"]), cart.emptyCart);
router.delete("/:cid/product/:pid", checkUserRole(["usuario" ,"premium"]), cart.deleteProductToCart);

module.exports = router;
