const formulario = document.getElementById("miFormulario");
const mensajeDiv = document.getElementById("mensajeRespuesta");
const btnEnviar = document.getElementById("btnEnviar");
const btnCargar = document.getElementById("btnCargar");
const cabecera = document.getElementById("cabeceraTabla");
const cuerpoTabla = document.getElementById("table");

formulario.addEventListener("submit", async function (e) {
    e.preventDefault(); // 1. Evitamos que el navegador recargue la página
    // UX: Feedback visual (Deshabilitar botón)
    btnEnviar.disabled = true;
    btnEnviar.innerText = "Enviando...";
    mensajeDiv.innerText = "";
    // 2. Empaquetado automático de datos
    const datos = new FormData(formulario);
    try {
        // 3. Petición al servidor (La Promesa)
        const respuesta = await fetch("servidor.php", {
            method: "POST",
            body: datos,
        });
        // 4. Validación técnica (¿El servidor respondió un código 200?)
        if (!respuesta.ok) throw new Error("Error HTTP: " + respuesta.status);
        // 5. Desempaquetado (Leer JSON)
        const data = await respuesta.json();
        // 6. Mostrar resultado
        if (data.status === "ok") {
            mensajeDiv.style.color = "green";
            mensajeDiv.innerText = `Éxito: ${data.mensaje}`;
            formulario.reset(); // Limpiar campos
            cargarDatos() // Cargamos nuevamente los datos
        } else {
            throw new Error(data.error || "Error desconocido");
        }
    } catch (error) {
        // Manejo de errores (Red caída o error lanzado manualmente)
        console.error("Hubo un problema:", error);
        mensajeDiv.style.color = "red";
        mensajeDiv.innerText = "Error: " + error.message;
    } finally {
        // UX: Restaurar botón siempre, pase lo que pase
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Registrar";
    }
});

btnCargar.addEventListener('click', cargarDatos);
document.addEventListener('DOMContentLoaded', cargarDatos);

async function cargarDatos() {
    try {
        
        const respuesta = await fetch("servidor.php");
        // Validación datos
        if (!respuesta.ok) throw new Error("Error HTTP: " + respuesta.status);
        
        const respuestaData = await respuesta.json();
        if (respuestaData.status === "ok") {
            cabecera.innerHTML = "";
            cuerpoTabla.innerHTML = "";
            const usuarios = respuestaData.data;
            
            // console.log(Object.keys(usuarios[0]));
            // console.log(usuarios);
            
            if (usuarios.length == 0) throw new Error("Error, BD vacía");
            
            let datosCabecera = Object.keys(usuarios[0]);
            
            datosCabecera.forEach(clave => {
                
                const thClave = document.createElement('th');
                
                thClave.innerHTML = clave;
                
                cabecera.appendChild(thClave);
                
            });
            
            const thAcciones = document.createElement('th');
            thAcciones.innerHTML = 'Acciones';
            cabecera.appendChild(thAcciones);
            
            usuarios.forEach(usuario => {
                const fila = document.createElement('tr');
    
                datosCabecera.forEach(clave => {
                    const celda = document.createElement('td');
                    celda.innerHTML = usuario[clave];
                    fila.appendChild(celda);
                });
                
                // Celda con botón de eliminar
                const celdaAcciones = document.createElement('td');
                const btnEliminar = document.createElement('button');
                btnEliminar.innerHTML = 'Eliminar';
                btnEliminar.className = 'btn-eliminar'; // Para CSS
                
                // Evento click
                btnEliminar.addEventListener('click', () => {
                    eliminarUsuario(usuario.correo);
                });
                
                celdaAcciones.appendChild(btnEliminar);
                fila.appendChild(celdaAcciones);
                
                cuerpoTabla.appendChild(fila);
            });
            
        } else {
            throw new Error(data.error || "Error desconocido");
        }
        
        
        
    } catch (error) {
        // Manejo de errores (Red caída o error lanzado manualmente)
        console.error("Hubo un problema:", error);
        mensajeDiv.style.color = "red";
        mensajeDiv.innerText = "Error: " + error.message;
    }
}

async function eliminarUsuario(correo) {
    try {
        const respuesta = await fetch('servidor.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correo })
        });
        
        const data = await respuesta.json();
        if (data.status === 'ok') {
            console.log('Usuario eliminado');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        cargarDatos();
    }
}
