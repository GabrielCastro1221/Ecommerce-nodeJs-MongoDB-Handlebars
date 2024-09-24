const socket = io();
const $ = document;

socket.on("products", (data) => { viewProducts(data) });

const viewProducts = (productos) => {
  const prods = $.getElementById("product-list");
  prods.innerHTML = "";
  productos.docs.forEach((item) => {
    const cardProds = $.createElement("div");
    cardProds.innerHTML = `
        <div class="cardProd-admin-container">
            <img src=${item.thumbnail} alt=${item.title}>
        <div>
              <div class="detail">
                  <p><span>Id del producto:</span> ${item._id}</p>
                  <p><span>titulo:</span> ${item.title}</p>
                  <p><span>Stock:</span> ${item.stock}</p>
                  <p><span>Precio:</span> $${item.price}</p>
                  <p><span>categoria:</span> ${item.category}</p>
                  <p><span>codigo:</span> ${item.code}</p>
                  <p><span>Descripcion:</span> ${item.description}</p>
              </div>
              <div class="controls d-flex align-items-center justify-content-start">
                  <button type="button" class="btn-card-danger" onclick="deleteProduct('${String(item._id)}')">Eliminar</button>
              </div>
        </div>
    </div>
        `;
    prods.appendChild(cardProds);
    cardProds.querySelector("button").addEventListener("click", () => { deleteproduct(item._id) });
  });
};

const deleteproduct = (id) => { socket.emit("deleteProd", id) };
$.getElementById("btnEnviar").addEventListener("click", () => { addProduct() });

const addProduct = () => {
  const producto = {
    title: $.getElementById("title").value,
    thumbnail: $.getElementById("img").value,
    description: $.getElementById("description").value,
    price: $.getElementById("price").value,
    img: $.getElementById("img").value,
    code: $.getElementById("code").value,
    stock: $.getElementById("stock").value,
    category: $.getElementById("category").value,
    status: $.getElementById("status").value === "true",
  };
  socket.emit("addProd", producto);
};