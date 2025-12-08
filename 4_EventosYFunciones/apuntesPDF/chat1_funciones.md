Aquí tienes una explicación completa y didáctica sobre **expresión de funciones**, **funciones flecha**, **funciones básicas**, y **callbacks en JavaScript**, con **ejemplos claros y ejercicios resueltos**.

---

# 📌 1. Funciones básicas (declaradas)

Son las funciones clásicas de JavaScript. Se definen con la palabra **function**, tienen nombre y pueden recibir parámetros.

### 📘 Sintaxis

```javascript
function nombreFuncion(parámetros){
    // código a ejecutar
    return valor; // opcional
}
```

### Ejemplo

```javascript
function saludar(nombre){
    return "Hola " + nombre;
}

console.log(saludar("Ana")); // → Hola Ana
```

### Datos clave

* Se pueden llamar **antes o después** de ser declaradas (hoisting).
* Pueden o no devolver valores.
* Se usan mucho para lógica reutilizable.

---

### 🔍 Ejercicio resuelto

**Crear una función que reciba dos números y devuelva la suma.**

```javascript
function sumar(a, b){
    return a + b;
}
console.log(sumar(5, 3)); // → 8
```

---

# 📌 2. Expresión de funciones

Una función también puede guardarse dentro de una variable. A esto se le llama **función expresión** o **function expression**.

### 📘 Sintaxis

```javascript
const nombreVariable = function(parámetros){
    // código
};
```

### Ejemplo

```javascript
const multiplicar = function(x, y){
    return x * y;
};

console.log(multiplicar(4, 6)); // → 24
```

### Datos clave

* No tiene nombre propio (anónima normalmente).
* **No se puede usar antes de su declaración**.
* Útil para pasar funciones como valores → base de los callback.

---

### 🔍 Ejercicio resuelto

**Crear una función expresión que calcule el cuadrado de un número.**

```javascript
const cuadrado = function(n){
    return n * n;
};

console.log(cuadrado(7)); // → 49
```

---

# 📌 3. Funciones Flecha (Arrow functions)

Es una forma más corta de escribir funciones. Se introdujeron en **ES6 (2015)**.

### 📘 Sintaxis

```javascript
const nombre = (parámetros) => {
    return valor;
};
```

### Ventajas

✔ Más compactas
✔ No usan `this` propio → mejor en callbacks
✔ Se usan mucho en programación funcional

### Ejemplos equivalentes

```javascript
// Función clásica
function restar(a, b){
    return a - b;
}

// Función flecha equivalente
const restarFlecha = (a, b) => a - b;

console.log(restarFlecha(10, 3)); // → 7
```

### Casos prácticos rápidos

```javascript
const hola = () => "Hola mundo";
console.log(hola());

const doble = n => n * 2; // un parámetro → sin paréntesis
console.log(doble(6));
```

---

### 🔍 Ejercicio resuelto

**Crear una función flecha que convierta grados Celsius a Fahrenheit.**

```javascript
const celsiusAF = c => (c * 9/5) + 32;

console.log(celsiusAF(30)); // → 86°F
```

---

# 📌 4. Callbacks

Un **callback es una función que se pasa como parámetro a otra función para ejecutarse dentro de ella**.

Permiten manejar tareas asincrónicas, temporizadores, animaciones, eventos, etc.

### 📘 Sintaxis

```javascript
function funcionPrincipal(callback){
    callback(); // se ejecuta dentro
}
```

### Ejemplo básico

```javascript
function mensaje(){
    console.log("Callback ejecutado");
}

function ejecutar(fn){
    console.log("Inicio");
    fn(); // ejecutamos callback
    console.log("Fin");
}

ejecutar(mensaje);
```

---

### Ejemplo con función flecha como callback

```javascript
setTimeout(() => {
    console.log("Han pasado 2 segundos");
}, 2000);
```

### Datos clave

* Permite ejecutar una acción después de otra.
* Base de `promises`, `async/await`.
* Muy utilizado en procesos asíncronos.

---

### 🔍 Ejercicio resuelto

**Crear una función que reciba un número y una función callback para operar con él.**

```javascript
function operarNumero(num, callback){
    console.log("Resultado:", callback(num));
}

const triple = n => n * 3;
operarNumero(5, triple); // → Resultado: 15
```

Otro callback diferente:

```javascript
operarNumero(5, n => n + 10); // → Resultado: 15
```

---

# ⭐ Resumen rápido

| Tema                 | Características          | Se usa para                         |
| -------------------- | ------------------------ | ----------------------------------- |
| Funciones básicas    | `function nombre()`      | Código reutilizable, hoisting       |
| Expresión de función | `const f = function(){}` | Guardar funciones en variables      |
| Arrow function       | `const f = () => {}`     | Sintaxis corta, callbacks           |
| Callback             | Función como argumento   | Asincronía, eventos, lógica modular |

---

Si quieres, puedo prepararte:

📄 una hoja imprimible con resumen
🧠 ejercicios adicionales para practicar
🧩 mini proyectos basados en eventos + callbacks

¿Te lo preparo? 😊
