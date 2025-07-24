async function obtenerTodos() {
    try {
        const respuesta = await fetch('https://my-json-server.typicode.com/ExequielEchevarria/telefonos/db', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });
        const data = await respuesta.json();
        let cuerpoTabla = document.getElementById("tblContenido");
        let salida = "";
        for (let elemento of data.dispositivos) {
            salida += `
                <tr>
                    <td>${sanitize(elemento.id)}</td>
                    <td>${sanitize(elemento.marca)}</td>
                    <td>${sanitize(elemento.modelo)}</td>
                    <td>${sanitize(elemento.color)}</td>
                    <td>${sanitize(elemento.almacenamiento)} GB</td>
                    <td>${sanitize(elemento.procesador)}</td>
                </tr>
            `;
        }
        cuerpoTabla.innerHTML = salida;
        animateRows();
    } catch (error) {
        showToast("Error al cargar dispositivos", "error");
        console.error(error);
    }
}

async function consultarUno() {
    try {
        let id = document.getElementById('txtConsulta').value.trim();
        if (!id || isNaN(id) || Number(id) < 1) {
            showToast('Ingrese un ID válido', "error");
            return;
        }
        const respuesta = await axios.get('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/' + id);
        let dispositivo = respuesta.data;
        if (!dispositivo || Object.keys(dispositivo).length === 0) {
            showToast('No se encontró el dispositivo', "error");
            return;
        }
        document.getElementById('consultaNombre').value = sanitize(dispositivo.marca);
        document.getElementById('consultaModelo').value = sanitize(dispositivo.modelo);
        document.getElementById('consultaColor').value = sanitize(dispositivo.color);
        document.getElementById('consultaAlmacenamiento').value = sanitize(dispositivo.almacenamiento) + ' GB';
        document.getElementById('consultaProcesador').value = sanitize(dispositivo.procesador);
        showToast('Consulta exitosa', "success");
    } catch (error) {
        showToast("Error al consultar", "error");
        console.error(error);
    }
}

async function agregarUno() {
    try {
        let marca = sanitize(document.getElementById("inputMarca").value);
        let modelo = sanitize(document.getElementById("inputModelo").value);
        let color = sanitize(document.getElementById("inputColor").value);
        let almacenamiento = sanitize(document.getElementById("inputAlmacenamiento").value);
        let procesador = sanitize(document.getElementById("inputProcesador").value);

        if (!marca || !modelo || !color || !almacenamiento || !procesador) {
            showToast("Completa todos los campos", "error");
            return;
        }

        const respuesta = await fetch('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                marca, modelo, color, almacenamiento, procesador
            })
        });
        const data = await respuesta.json();
        obtenerTodos();
        showToast(`Artículo agregado: ${data.marca} ${data.modelo}`, "success");
    } catch (error) {
        showToast("Error al agregar", "error");
        console.error(error);
    }
}

async function modificarUno() {
    try {
        let id = document.getElementById('txtConsulta').value.trim();
        let nombre = sanitize(document.getElementById('consultaNombre').value);
        let modelo = sanitize(document.getElementById('consultaModelo').value);
        let color = sanitize(document.getElementById('consultaColor').value);
        let almacenamiento = sanitize(document.getElementById('consultaAlmacenamiento').value.replace(' GB', ''));
        let procesador = sanitize(document.getElementById('consultaProcesador').value);

        if (!id || !nombre || !modelo || !color || !almacenamiento || !procesador) {
            showToast('Completa todos los campos para modificar', "error");
            return;
        }

        const respuesta = await fetch('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/' + id, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                marca: nombre,
                modelo,
                color,
                almacenamiento,
                procesador
            })
        });
        const data = await respuesta.json();
        showToast(`Artículo modificado: ${data.marca} ${data.modelo}`, "success");
        obtenerTodos();
    } catch (error) {
        showToast("Error al modificar", "error");
        console.error(error);
    }
}

async function eliminarUno() {
    try {
        let id = document.getElementById('txtConsulta').value.trim();
        if (!id || isNaN(id) || Number(id) < 1) {
            showToast('Ingrese un ID válido', "error");
            return;
        }
        await axios.delete('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/' + id);
        showToast(`Artículo eliminado: ${id}`, "success");
        document.getElementById('consultaNombre').value = "";
        document.getElementById('consultaModelo').value = "";
        document.getElementById('consultaColor').value = "";
        document.getElementById('consultaAlmacenamiento').value = "";
        document.getElementById('consultaProcesador').value = "";
        obtenerTodos();
    } catch (error) {
        showToast("Error al eliminar", "error");
        console.error(error);
    }
}

// Animación para filas nuevas
function animateRows() {
    const rows = document.querySelectorAll("#tblContenido tr");
    rows.forEach(row => {
        row.classList.add("fade-in-row");
        setTimeout(() => row.classList.remove("fade-in-row"), 800);
    });
}

// Feedback visual
function showToast(msg, type = "info") {
    let toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Validación básica para evitar XSS
function sanitize(str) {
    return String(str).replace(/[<>"'`]/g, "");
}

// Animación CSS para filas y toast
// Agrega esto a tu CSS:
/*
.fade-in-row {
    animation: fadeInUp 0.8s;
}
.toast {
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 9999;
    padding: 16px 28px;
    border-radius: 12px;
    font-size: 1.1rem;
    box-shadow: 0 4px 16px #0002;
    background: #fffde4;
    color: #556b2f;
    opacity: 0.95;
    animation: fadeInDown 0.7s;
}
.toast-success { background: #b6c26b; color: #fff; }
.toast-error { background: #e74c3c; color: #fff; }
.toast-info { background: #556b2f; color: #fff; }
*/