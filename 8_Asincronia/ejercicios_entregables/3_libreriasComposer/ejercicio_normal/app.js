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
            
            if (usuarios.length == 0) throw new Error("BD vacía");
            
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
                    celda.dataset.campo = clave; // Guardar qué campo es
                    fila.appendChild(celda);
                });
                
                // Celda con botón de eliminar
                const celdaAcciones = document.createElement('td');
                
                // Botón Editar
                const btnEditar = document.createElement('button');
                btnEditar.innerHTML = 'Editar';
                btnEditar.className = 'btn-editar';

                btnEditar.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const celdas = fila.querySelectorAll('td');
                    
                    // Si ya está en modo edición (es botón "Guardar")
                    if (btnEditar.className === 'btn-guardar') {
                        const inputs = fila.querySelectorAll('input');
                        const selects = fila.querySelectorAll('select');
                        
                        const nuevoNombre = inputs[0]?.value;
                        const correoOriginal = celdas[1].textContent;
                        const nuevoMovil = inputs[1]?.value;
                        const nuevaEdad = inputs[2]?.value;
                        const nuevoNivel = selects[0]?.value || null;
                        
                        console.log('Datos a enviar:');
                        console.log('- Correo (identificador):', correoOriginal);
                        console.log('- Nuevo nombre:', nuevoNombre);
                        console.log('- Nuevo móvil:', nuevoMovil);
                        console.log('- Nueva edad:', nuevaEdad);
                        console.log('- Nuevo nivel:', nuevoNivel);
                        
                        // Validación de móvil (debe empezar con 6 o 7 y tener 9 dígitos)
                        const movilRegex = /^[67][0-9]{8}$/;
                        if (!movilRegex.test(nuevoMovil)) {
                            alert('El móvil debe empezar por 6 o 7 y tener 9 dígitos');
                            return;
                        }
                        
                        // Validación de edad (debe ser mayor o igual a 18)
                        const edadNum = parseInt(nuevaEdad);
                        if (isNaN(edadNum) || edadNum < 18) {
                            alert('La edad debe ser mayor o igual a 18');
                            return;
                        }
                        
                        actualizarUsuario(correoOriginal, nuevoNombre, nuevoMovil, nuevaEdad, nuevoNivel).then(actualizado => {
                            if (actualizado) {
                                // Volver a mostrar valores normales
                                celdas[0].textContent = nuevoNombre;
                                celdas[2].textContent = nuevoMovil;
                                celdas[3].textContent = nuevaEdad;
                                celdas[4].textContent = nuevoNivel || '';
                                
                                btnEditar.innerHTML = 'Editar';
                                btnEditar.className = 'btn-editar';
                                
                                // Remover botón cancelar si existe
                                const btnCancelar = btnEditar.parentElement.querySelector('.btn-cancelar');
                                if (btnCancelar) {
                                    btnCancelar.remove();
                                }
                            } else {
                                alert('Error al actualizar');
                            }
                        });
                    } else {
                        // Guardar valores originales antes de editar
                        const valoresOriginales = [];
                        
                        // Modo edición - convertir a inputs
                        const correoOriginal = celdas[1].textContent;
                        console.log('Correo original capturado:', correoOriginal);
                        
                        celdas.forEach((celda, index) => {
                            // Excluir correo (index 1) y columna de botones (última)
                            if (index !== 1 && index < celdas.length - 1) {
                                const valorActual = celda.textContent.trim();
                                valoresOriginales[index] = valorActual;
                                
                                // index 0: nombre
                                // index 1: correo (no editable)
                                // index 2: movil
                                // index 3: edad
                                // index 4: nivel_idioma
                                
                                if (index === 4) {
                                    // Para nivel_idioma crear un select
                                    celda.innerHTML = `
                                        <select>
                                            <option value="">Ninguno</option>
                                            <option value="A1" ${valorActual === 'A1' ? 'selected' : ''}>A1</option>
                                            <option value="A2" ${valorActual === 'A2' ? 'selected' : ''}>A2</option>
                                            <option value="B1" ${valorActual === 'B1' ? 'selected' : ''}>B1</option>
                                            <option value="B2" ${valorActual === 'B2' ? 'selected' : ''}>B2</option>
                                            <option value="C1" ${valorActual === 'C1' ? 'selected' : ''}>C1</option>
                                            <option value="C2" ${valorActual === 'C2' ? 'selected' : ''}>C2</option>
                                        </select>
                                    `;
                                } else {
                                    celda.innerHTML = `<input type="text" value="${valorActual}">`;
                                }
                            }
                        });
                        
                        // Cambiar botón a "Guardar"
                        btnEditar.innerHTML = 'Guardar';
                        btnEditar.className = 'btn-guardar';
                        
                        // Crear botón "Cancelar"
                        const btnCancelar = document.createElement('button');
                        btnCancelar.innerHTML = 'Cancelar';
                        btnCancelar.className = 'btn-cancelar';
                        btnCancelar.style.marginLeft = '5px';
                        
                        btnCancelar.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Restaurar valores originales
                            celdas.forEach((celda, index) => {
                                if (valoresOriginales[index] !== undefined) {
                                    celda.textContent = valoresOriginales[index];
                                }
                            });
                            
                            // Restaurar botón Editar
                            btnEditar.innerHTML = 'Editar';
                            btnEditar.className = 'btn-editar';
                            btnCancelar.remove();
                        });
                        
                        // Insertar botón cancelar después del botón guardar
                        btnEditar.parentElement.appendChild(btnCancelar);
                    }
                });
                
                // Botón eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.innerHTML = 'Eliminar';
                btnEliminar.className = 'btn-eliminar'; // Para CSS
                
                // Evento click
                btnEliminar.addEventListener('click', () => {
                    eliminarUsuario(usuario.correo);
                });
                
                celdaAcciones.appendChild(btnEditar);
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

async function actualizarUsuario(correoActual, nuevoNombre, nuevoMovil, nuevaEdad, nuevoNivel) {
    const payload = { 
        correo: correoActual,
        nombre: nuevoNombre,
        movil: nuevoMovil,
        edad: nuevaEdad,
        nivel_idioma: nuevoNivel
    };
    
    console.log('Payload enviado a servidor:', payload);
    
    try {
        const respuesta = await fetch('servidor.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data);
        
        if (data.status === 'ok') {
            console.log('Usuario actualizado');
            return true;
        } else {
            console.error(data.error);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}
