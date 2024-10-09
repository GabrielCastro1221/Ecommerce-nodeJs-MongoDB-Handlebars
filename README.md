# SkateShop - Ecommerce Full Stack

## Descripción:

Este proyecto es una ecommerce especializada en la venta de productos para skaters, desarrollada como parte del proyecto de grado de la carrera de Programación Full Stack en Coderhouse. La aplicación está construida utilizando Node.js y MongoDB, implementando diversas tecnologías y patrones de diseño modernos que la hacen robusta y escalable.

`Características principales:`

+ `Administrador de Productos en Tiempo Real:` Gracias al uso de WebSockets, la administración de productos es dinámica. Los cambios en los productos, como actualizaciones de inventario o nuevos productos, se reflejan en tiempo real para los administradores y usuarios.

`Chat Comunitario para Skaters:` La página cuenta con un chat comunitario donde los usuarios pueden interactuar en tiempo real, creando un espacio para la comunidad skater dentro de la ecommerce.

`Patrones de Diseño Avanzados:` Se utiliza el patrón de diseño Singleton para gestionar la conexión con la base de datos, asegurando una única instancia en toda la aplicación, y el patrón Commander para permitir la ejecución de diferentes scripts dentro de la aplicación de forma eficiente.

`Autenticación Segura:` La autenticación de los usuarios está protegida mediante JWT (JSON Web Tokens), garantizando sesiones seguras y el acceso controlado a las diferentes funcionalidades según el rol (usuario, administrador, etc.).

`Administrador de Usuarios:` El sistema permite gestionar los usuarios, sus roles y permisos, incluyendo la promoción de usuarios regulares a premium, así como la eliminación de cuentas inactivas.

`Carrito de Compras y Generación de Tickets:` Los usuarios pueden agregar productos a su carrito de compras y, al finalizar, se genera un ticket de compra, proporcionando una experiencia de usuario completa y profesional.

Este proyecto destaca por su arquitectura moderna y su capacidad para ofrecer funcionalidades en tiempo real, además de su enfoque en la seguridad y la experiencia del usuario.