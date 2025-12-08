A continuación tienes el trabajo solicitado basado en el documento **UD04 – Eventos (HTML + JavaScript)**:

---

# 📌 **10 Ejercicios prácticos en HTML + JavaScript sobre eventos**

Puedes copiar cada ejercicio en un archivo `.html` para probarlos.

---

### **1. Mostrar un mensaje al hacer clic en un botón**

```html
<button onclick="alert('Hola Mundo!')">Haz clic</button>
```

---

### **2. Cambiar el color de un div cuando el ratón pasa por encima**

```html
<div id="caja" onmouseover="this.style.background='yellow'" 
     onmouseout="this.style.background='white'"
     style="width:150px;height:80px;border:1px solid black;">
     Pasa el ratón
</div>
```

---

### **3. Mostrar coordenadas del clic**

```html
<div onclick="alert('Posición X:'+event.clientX+' Y:'+event.clientY)" 
     style="padding:20px;border:1px solid;">
     Haz clic dentro
</div>
```

---

### **4. Cambiar el texto de un botón usando this**

```html
<button onclick="this.innerText='Gracias!'">Púlsame</button>
```

---

### **5. Detectar tecla pulsada**

```html
<input type="text" onkeyup="alert('Código:'+event.keyCode)">
```

---

### **6. Asignar evento desde JavaScript**

```html
<button id="btn">Click</button>

<script>
document.getElementById("btn").onclick = function(){
    alert("Evento asignado desde JS");
}
</script>
```

---

### **7. Ejecutar código sólo cuando cargue la página**

```html
<script>
window.onload = function(){
    alert("Página cargada completamente.");
}
</script>
```

---

### **8. Mismo manejador para varios eventos**

```html
<button id="multi">Prueba</button>

<script>
function mostrar(e){
    alert("Evento: " + e.type);
}
document.getElementById("multi").onclick = mostrar;
document.getElementById("multi").ondblclick = mostrar;
</script>
```

---

### **9. Uso de `addEventListener()`**

```html
<button id="escucha">Listener</button>

<script>
document.getElementById("escucha").addEventListener("click",()=>alert("Listener activo"));
</script>
```

---

### **10. Ejemplo básico Drag & Drop**

```html
<div id="zona" ondrop="soltar(event)" ondragover="permitir(event)" 
     style="width:200px;height:200px;border:2px dashed"></div>

<img id="img" src="https://via.placeholder.com/100" draggable="true"
     ondragstart="arrastrar(event)">

<script>
function permitir(e){ e.preventDefault(); }
function arrastrar(e){ e.dataTransfer.setData("texto", e.target.id); }
function soltar(e){
    e.preventDefault();
    let data = e.dataTransfer.getData("texto");
    e.target.appendChild(document.getElementById(data));
}
</script>
```

---

# 📘 **20 Preguntas tipo test del tema Eventos**

Selecciona la opción correcta.

1. Un evento ocurre cuando…

   * a) El navegador hace una pausa
   * b) Se detecta una acción del usuario o del sistema ✔
   * c) No existe interacción
   * d) El HTML tiene errores

2. ¿Qué evento detecta un clic simple?

   * a) ondblclick
   * b) onmouseover
   * c) onclick ✔
   * d) onpress

3. El evento que se ejecuta al cargar la página:

   * a) onload ✔
   * b) onstart
   * c) onopen
   * d) oninit

4. ¿Qué hace `this` dentro de un evento?

   * a) Referencia al window
   * b) Referencia al elemento que lanzó el evento ✔
   * c) Es una variable global
   * d) No tiene función

5. ¿Qué evita que el navegador realice la acción por defecto?

   * a) stop()
   * b) preventDefault() ✔
   * c) cancel()
   * d) block()

6. ¿Qué evento detecta cuando se presiona una tecla sin soltar?

   * a) keypress
   * b) keyup
   * c) keydown ✔
   * d) onkey

7. Para asignar un evento desde código usamos:

   * a) document.add()
   * b) element.onclick = funcion; ✔
   * c) element.event()
   * d) window.assign()

8. Para añadir múltiples escuchas a un elemento:

   * a) addEventListener() ✔
   * b) attach()
   * c) onclick
   * d) onadd

9. ¿Qué propiedad del evento devuelve el tipo?

   * a) e.key
   * b) e.id
   * c) e.type ✔
   * d) e.name

10. ¿Qué evento ocurre al salir del foco?

* a) onblur ✔
* b) onfocus
* c) onchange
* d) onout

11. Evento cuando pasa el ratón sobre un elemento:

* a) ondrag
* b) onenter
* c) onmouseover ✔
* d) onhover

12. ¿Qué atributo devuelve la tecla pulsada?

* a) keyCode ✔
* b) codeKey
* c) keypress
* d) keyboard

13. ¿Cuál es correcto?

* a) onclick="miFuncion()"
* b) element.onclick = miFuncion; ✔
* c) element.onclick("miFuncion")
* d) click.element(miFuncion)

14. ¿En qué objeto se almacenan datos al arrastrar?

* a) sessionStorage
* b) dragData
* c) dataTransfer ✔
* d) eventStore

15. Evento al soltar un elemento arrastrado:

* a) drop ✔
* b) drag
* c) leave
* d) unload

16. Evento para enviar un formulario:

* a) onenter
* b) onsubmit ✔
* c) onsend
* d) formclick

17. Al usar `addEventListener("click", fn)`:

* a) Ejecuta fn inmediatamente
* b) Fn se ejecuta al hacer clic ✔
* c) No ocurre nada
* d) Reemplaza todos los eventos

18. ¿Qué evento escucha movimiento dentro de un elemento?

* a) onmousemove ✔
* b) onwheel
* c) onmouseclick
* d) onleave

19. Para obtener coordenadas del ratón:

* a) event.xPos
* b) event.screenX ✔ / event.screenY ✔
* c) event.getPos
* d) mouse.coords

20. Drag & Drop requiere:

* a) draggable="true" ✔
* b) mover="y"
* c) drag="allow"
* d) enableDrag()

---

# 📝 Explicación breve de puntos clave

### 🔹 ¿Qué es un evento?

Es una acción detectada por el navegador (clic, teclado, carga de página…). Permite responder con código cuando ocurre algo.

### 🔹 Formas de asignar eventos

1. **Desde HTML**

   ```html
   <button onclick="algo()">Click</button>
   ```

   Fácil, pero mezcla código con estructura.

2. **Desde JavaScript**

   ```javascript
   element.onclick = funcion;
   ```

   Más limpio y recomendado.

3. **Con addEventListener**
   Permite varios manejadores y más control.

   ```javascript
   element.addEventListener("click", funcion);
   ```

### 🔹 Objeto `event`

El navegador lo envía automáticamente cuando un evento ocurre. Contiene:

* `type` → tipo de evento
* `keyCode` → tecla pulsada
* `clientX/Y` → posición del ratón

### 🔹 Drag & Drop

Se basa en eventos como `dragstart`, `drop`, `dragover`. Muy útil para interfaces interactivas.

---