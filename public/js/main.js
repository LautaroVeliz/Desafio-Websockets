const socket = io.connect()

socket.on('productos', (data) => {
    render_table(data)
})

socket.on('messages', function(data) {
    render_chat(data)
})

function render_table(data) {
    let str_table = ''
    if (data.length !== 0) {
        str_table = `<div class="table-responsive">
                        <table class="table table-dark">
                        <tr style="color: yellow;">
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Imagen</th>
                        </tr>`
        data.forEach(producto => {
            str_table = str_table.concat(`
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td><img src="${producto.foto_URL}" alt="${producto.nombre}" width="60" height="60"></td>
            </tr>`)
        });
        str_table = str_table.concat(`
            </table>
        </div>`);
    } else {
        str_table = `<div class="table-responsive">
            <table class="table table-dark">
            <tr style="color: yellow;">
            <th>NO HAY PRODUCTOS</th>
            </tr>
            </table>
            </div>`
    }
    let template = Handlebars.compile(document.querySelector("#template_table").innerHTML)
    let filled = template({ datos_de_tabla: str_table })
    document.querySelector("#table_div").innerHTML = filled
}

function render_chat(data) {
    let str_messages = ''
    if (data.length !== 0) {
        data.forEach(mensaje => {
            str_messages = str_messages.concat(
                `<p style="color: brown"><b style="color: blue">${mensaje.email}</b>[${mensaje.time}] <i style="color: green">: ${mensaje.text}</i></p>`);
        });
        let template = Handlebars.compile(document.querySelector("#template_messages").innerHTML)
        let filled = template({ datos_de_mesajes: str_messages })
        document.querySelector("#mensajes_div").innerHTML = filled
    }
}

function addProducto(e) {
    const producto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        foto_URL: document.getElementById('foto_URL').value,
    }
    socket.emit('new-producto', producto)
    document.getElementById("product_form").reset();
    return false
}

function addMessage(e) {
    let date = new Date();
    const mensaje = {
        email: document.getElementById('email').value,
        time: `${date.toLocaleDateString()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`,
        text: document.getElementById('texto').value,
    }
    socket.emit('new-message', mensaje)
    document.getElementById("message_form").reset();
    return false
}