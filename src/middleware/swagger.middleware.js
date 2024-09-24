const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentacion API Ecommerce",
        description:
          "Ecommerce dedicada a la venta de productos relacionados con el SkateBoarding",
      },
    },
    apis: ["./src/docs/**/*.yaml"],
  };

  module.exports = { swaggerOptions };