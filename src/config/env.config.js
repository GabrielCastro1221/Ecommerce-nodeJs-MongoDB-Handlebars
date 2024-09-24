const dotenv = require("dotenv");
const program = require("./commander.config");

const { mode } = program.opts();
dotenv.config({ path: mode === "dev" ? "./.env.dev" : "./.env.build" });

const configObject = {
  server: {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT || 5000,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
    cookie_token: process.env.COOKIE_TOKEN,
  },
  mailer: {
    mailer_user: process.env.MAILER_USER,
    mailer_pass: process.env.MAILER_PASS,
  },
  winston: {
    node_env: process.env.NODE_ENV,
  },
  mercado_pago: {
    mp_access_token: process.env.MP_ACCESS_TOKEN
  }
};

module.exports = configObject;
