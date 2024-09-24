const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");

const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const { swaggerOptions } = require("./middleware/swagger.middleware");
const { logger } = require("./middleware/logger.middleware");
const auth = require("./middleware/authmiddleware");

const initializePassport = require("./config/passport.config");
const configObject = require("./config/env.config");
require("./database.js");

const Socket = require("./sockets/socket");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const userRouter = require("./routes/user.router");

const app = express();
const PORT = configObject.server.port;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize());
app.use(auth);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

initializePassport();
const specs = swaggerJSDoc(swaggerOptions);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const httpServer = app.listen(PORT, () => {
  logger.info(`Server connected on port ${PORT} and running on http://localhost:${PORT}`);
});

new Socket(httpServer);