const socketClient = io();
const $ = document;
const formulario = $.getElementById("formulario");
const inputmensaje = $.getElementById("mensaje");
const chat = $.getElementById("chat");

function scrollToBottom() {
    const chatContainer = $.getElementById("chat-messages");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

formulario.onsubmit = (e) => {
    e.preventDefault();
    const info = { message: inputmensaje.value }
    console.log(info);
    socketClient.emit("mensaje", info);
    inputmensaje.value = " ";
    scrollToBottom();
}

socketClient.on("chat", mensajes => {
    const chatRender = mensajes.map(mensaje => {
        const fechaCreacion = new Date(mensaje.createdAt);
        const opcionesHora = { hour: '2-digit', minute: '2-digit' };
        const horaFormateada = fechaCreacion.toLocaleTimeString(undefined, opcionesHora);
        return `
            <p class="message-container">
                <strong>${horaFormateada}</strong> - 
                ${mensaje.message}
            </p>`;
    }).join("");
    chat.innerHTML = chatRender;
});

$.getElementById("clearChat").addEventListener("click", () => {
    $.getElementById("chat").textContent = "";
    socketClient.emit("clearchat");
});
