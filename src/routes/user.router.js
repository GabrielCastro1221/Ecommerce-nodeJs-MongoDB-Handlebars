const express = require("express");
const passport = require("passport");
const checkUserRole = require("../middleware/checkrole");
const UserController = require("../controllers/user.controller");

const router = express.Router();
const user = new UserController();

router.post("/register", user.register);
router.post("/login", user.login);
router.post("/logout", user.logout.bind(user));
router.post("/requestPasswordReset", user.requestPasswordReset);
router.post("/reset-password", user.resetPassword);

router.get("/profile", passport.authenticate("jwt", { session: false }), user.profile);
router.get("/", checkUserRole(["admin"]), user.getUsers);
router.get("/:uid", checkUserRole(["admin"]), user.getUserById);

router.put("/premium/:uid", checkUserRole(["admin"]), user.cambiarRolPremium);
router.put("/:uid", checkUserRole(["admin"]), user.updateUser);

router.delete("/:uid", checkUserRole(["admin"]), user.deleteUser);

module.exports = router;
