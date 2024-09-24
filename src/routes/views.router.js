const express = require("express");
const passport = require("passport");
const ViewsController = require("../controllers/view.controller");
const checkUserRole = require("../middleware/checkrole");
const ProductController = require("../controllers/product.controller");
const router = express.Router();
const views = new ViewsController();
const product = new ProductController();

router.get("/products", checkUserRole(["usuario", "premium"]), passport.authenticate("jwt", { session: false }), views.products);
router.get("/", views.login);
router.get("/register", views.register);
router.get("/home", checkUserRole(["usuario", "premium"]), views.home);
router.get("/realtimeproducts", checkUserRole(["admin", "premium"]), views.realTimeProducts);
router.get("/chat", checkUserRole(["usuario", "premium"]), views.chat);
router.get("/carts/:cid", checkUserRole(["usuario", "premium"]), views.cart);
router.get("/404-not-found", views.notFound);
router.get("/access-denied", views.denied);
router.get("/reset-password", views.resetPassword);
router.get("/password", views.cambioPassword);
router.get("/confirmacion-envio", views.confirmacion);
router.get("/admin-users", checkUserRole(["admin"]), views.adminUsers);
router.get("/products/:pid", checkUserRole(["usuario", "premium"]), views.productDetail);

module.exports = router;
