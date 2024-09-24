const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const EmailManager = require("../services/mailer/mailer");
const configObject = require("../config/env.config");
const { createHash, isValidPassword } = require("../utils/hashbcryp");
const DTO = require("../dto/user.dto.js");
const { generarResetToken } = require("../utils/tokenReset");
const { logger } = require("../middleware/logger.middleware");

const emailManager = new EmailManager();

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.render("register", { userRegisterError: "El usuario ya esta registrado" });
      }
      const newCart = new Cart();
      await newCart.save();
      const newUser = new User({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });
      await newUser.save();
      const token = jwt.sign({ user: newUser }, configObject.auth.jwt_secret, { expiresIn: "1h" });
      res.cookie(configObject.auth.cookie_token, token, { maxAge: 3600000, httpOnly: true });
      res.redirect("/api/users/profile");
    } catch (error) {
      logger.error(error);
      res.render("register", { RegisterError: "Error al registrar usuario" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const userFound = await User.findOne({ email });
      if (!userFound) {
        return res.render("login", { incorrectEmail: "El email no esta asociado a ningun cuenta" });
      }
      const isValid = isValidPassword(password, userFound);
      if (!isValid) {
        return res.render("login", { incorrectPassword: "Contraseña incorrecta" });
      }
      const token = jwt.sign({ user: userFound }, configObject.auth.jwt_secret, { expiresIn: "1h" });
      res.cookie(configObject.auth.cookie_token, token, { maxAge: 3600000, httpOnly: true });
      userFound.last_connection = new Date();
      await userFound.save();
      res.redirect("/api/users/profile");
    } catch (error) {
      logger.error(error);
      res.render("login", { loginError: "Error al iniciar sesion" });
    }
  }

  async profile(req, res) {
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
      res.render("profile", { user: dto, isAdmin, isUser, isPremium });
    } catch (error) {
      res.redirect("/404-not-found");
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie(configObject.auth.cookie_token);
      res.redirect("/");
    } catch (error) {
      res.redirect("/404-not-found");
    }
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("resetpassword", { userError: "Usuario no encontrado" });
      }
      const token = generarResetToken();
      user.resetToken = { token: token, expire: new Date(Date.now() + 3600000) };
      await user.save();
      await emailManager.enviarCorreoRestableciminto(email, user.first_name, token);
      res.redirect("/confirmacion-envio");
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("passwordCambio", { error: "Usuario no encontrado" });
      }
      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetpassword", { error: "Token invalido, intenta nuevamente" });
      }
      const now = new Date();
      if (now > resetToken.expire) {
        return res.render("resetpassword", { error: "el token ha expirado" });
      }
      if (isValidPassword(password, user)) {
        return res.render("passwordCambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
      }
      user.password = createHash(password);
      user.resetToken = undefined;
      await user.save();
      return res.redirect("/");
    } catch (error) {
      res.status(500).render("resetpassword", { error: "Error interno del servidor" });
    }
  }

  async getUsers(req, res) {
    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      await User.deleteMany({ last_connection: { $lt: twoDaysAgo } });
      const allUsers = await User.find();
      res.status(200).json({ allUsers, message: "Los usuarios inactivos han sido eliminados" });
    } catch (error) {
      res.status(500).send("Error al obtener usuarios");
    }
  }

  async getUserById(req, res) {
    const userID = req.params.uid;
    try {
      const user = await User.findById(userID);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).send("Error al obtener usuario");
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.uid;
      const userUpdate = req.body;
      const update = await User.findByIdAndUpdate(id, userUpdate);
      res.status(200).json({ usuario_actualizado: update });
    } catch (error) {
      res.status(500).send("Error al actualizar el usuario");
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.uid;
    try {
      let user = await User.findByIdAndDelete(userId);
      res.status(200).json({ Usuario_eliminado: user });
    } catch (error) {
      res.status(500).send("Error al eliminar el usuario");
    }
  }

  async cambiarRolPremium(req, res) {
    const { uid } = req.params;
    try {
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).send("usuario no encontrado");
      }
      const nuevoRol = user.role === "usuario" ? "premium" : "usuario";
      const actualizado = await User.findByIdAndUpdate(uid, { role: nuevoRol });
      res.status(200).json(actualizado);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
}

module.exports = UserController;
