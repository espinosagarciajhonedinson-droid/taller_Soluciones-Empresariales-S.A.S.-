/**
 * TALLER: SISTEMA DE GESTIÓN DE EMPLEADOS PROFESIONAL (SENA)
 * 
 * Este programa permite administrar la información de los empleados de una empresa.
 * Incluye conceptos avanzados como PERSISTENCIA DE DATOS (localStorage) para que
 * la información no se borre al actualizar la página.
 * 
 * @author Desarrollo Senior & Instructor SENA
 */

// Usamos "use strict" para que el navegador nos ayude a programar de forma más segura
"use strict";

// =============================================================================
// VARIABLES GLOBALES Y CONSTANTE DE MEMORIA
// =============================================================================

/**
 * empleados: Es nuestra "base de datos" local en forma de Arreglo.
 * JSON.parse: Convierte el texto guardado en localStorage de nuevo a objetos.
 * Si no hay nada guardado (primera vez), se inicializa como un arreglo vacío [].
 */
let empleados = JSON.parse(localStorage.getItem("db_sistema_sena")) || [];

// =============================================================================
// FUNCIONES DE SOPORTE (PERSISTENCIA)
// =============================================================================

/**
 * Nombre: sincronizarLocalStorage
 * Objetivo: Guardar el arreglo de empleados en la memoria permanente del navegador.
 * Proceso: Convierte el arreglo a texto con JSON.stringify y lo guarda.
 */
function sincronizarLocalStorage() {
    // Guardamos el arreglo bajo la clave 'db_sistema_sena'
    localStorage.setItem("db_sistema_sena", JSON.stringify(empleados));
    console.log("Sistema: Datos sincronizados permanentemente.");
    renderizarTabla(); // Actualizamos la vista siempre que guardamos
}

// =============================================================================
// FUNCIONES PRINCIPALES DEL SISTEMA
// =============================================================================

/**
 * Nombre: registrarEmpleado
 * Objetivo: Capturar datos del usuario y guardarlos en el arreglo.
 * Proceso: Valida duplicados, campos vacíos y guarda en localStorage.
 */
/**
 * Nombre: registrarEmpleadoDesdeForm
 * Objetivo: Captura los datos del formulario HTML en lugar de usar prompts.
 */
function registrarEmpleadoDesdeForm() {
    const idInput = document.getElementById("id");
    const nombreInput = document.getElementById("nombre");
    const cargoInput = document.getElementById("cargo");
    const salarioInput = document.getElementById("salario");
    const areaInput = document.getElementById("area");

    const identificacion = idInput.value.trim();
    const nombre = nombreInput.value.trim();
    const cargo = cargoInput.value.trim();
    const salario = parseFloat(salarioInput.value);
    const area = areaInput.value.trim();

    // 1. VALIDACIÓN
    if (!identificacion || !nombre || !cargo || isNaN(salario) || !area) {
        alert("ERROR: Por favor complete todos los campos correctamente.");
        return;
    }

    const existe = empleados.some(emp => emp.identificacion === identificacion);
    if (existe) {
        alert("ERROR: Ya existe un empleado con esa identificación.");
        return;
    }

    // 2. CREACIÓN Y GUARDADO
    const nuevoEmpleado = { identificacion, nombre, cargo, salario, area };
    empleados.push(nuevoEmpleado);
    sincronizarLocalStorage();

    // 3. LIMPIEZA
    idInput.value = "";
    nombreInput.value = "";
    cargoInput.value = "";
    salarioInput.value = "";
    areaInput.value = "";
    
    alert("¡Empleado registrado con éxito!");
}

/**
 * Nombre: renderizarTabla
 * Objetivo: Dibujar la base de datos en el HTML.
 */
function renderizarTabla() {
    const contenedor = document.getElementById("contenedor-tabla");
    
    if (empleados.length === 0) {
        contenedor.innerHTML = `<div class="empty-state">No hay empleados registrados todavía.</div>`;
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th>Área</th>
                    <th>Salario</th>
                </tr>
            </thead>
            <tbody>
    `;

    empleados.forEach(emp => {
        html += `
            <tr>
                <td>${emp.identificacion}</td>
                <td>${emp.nombre}</td>
                <td>${emp.cargo}</td>
                <td>${emp.area}</td>
                <td>$${emp.salario.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
}

/**
 * Nombre: listarEmpleados
 * Objetivo: Mostrar todos los registros actuales.
 * Proceso: Recorre el arreglo y construye un listado visual.
 */
function listarEmpleados() {
    // La propiedad .length nos dice cuántos elementos hay
    if (empleados.length === 0) {
        alert("No hay registros en la base de datos.");
        return;
    }

    let listado = "===== LISTADO DE EMPLEADOS =====\n\n";

    // Recorremos con un ciclo for...of por simplicidad y modernidad
    for (const emp of empleados) {
        listado += `ID: ${emp.identificacion}\n`;
        listado += `Nombre: ${emp.nombre}\n`;
        listado += `Área: ${emp.area}\n`;
        // .toLocaleString() le pone los puntos de miles al salario
        listado += `Salario: $${emp.salario.toLocaleString()}\n`;
        listado += "----------------------------\n";
    }

    alert(listado);
    console.table(empleados); // Formato tabla en consola para el instructor
}

/**
 * Nombre: buscarEmpleado
 * Objetivo: Encontrar un empleado por su ID.
 * Proceso: Usa el método .find() del arreglo.
 */
function buscarEmpleado() {
    const idBuscar = prompt("Ingrese el ID a buscar:")?.trim();
    if (!idBuscar) return;

    // .find busca el primer elemento que cumpla la condición
    const encontrado = empleados.find(emp => emp.identificacion === idBuscar);

    if (encontrado) {
        alert(`EMPLEADO ENCONTRADO:\nNombre: ${encontrado.nombre}\nCargo: ${encontrado.cargo}`);
    } else {
        alert("Esa identificación no está registrada.");
    }
}

/**
 * Nombre: eliminarDatos
 * Objetivo: Limpiar toda la base de datos.
 */
function eliminarDatos() {
    if (confirm("¿Desea borrar TODOS los empleados guardados?")) {
        empleados = []; // Vaciamos el arreglo
        localStorage.removeItem("db_sistema_sena"); // Borramos del almacenamiento
        alert("Base de datos reiniciada.");
    }
}

/**
 * Nombre: mostrarMenu
 * Objetivo: Controlar el ciclo de vida de la aplicación.
 */
function mostrarMenu() {
    let activo = true;

    while (activo) {
        const opciones = "SISTEMA PERSISTENTE S.A.S.\n\n" +
                         "1. Registrar Empleado\n" +
                         "2. Listar Todos\n" +
                         "3. Buscar por ID\n" +
                         "4. Borrar Base de Datos\n" +
                         "5. Salir";

        const seleccion = prompt(opciones);

        if (seleccion === null) break;

        switch (seleccion.trim()) {
            case "1": registrarEmpleado(); break;
            case "2": listarEmpleados(); break;
            case "3": buscarEmpleado(); break;
            case "4": eliminarDatos(); break;
            case "5": 
                alert("Saliendo... Sus datos están seguros en localStorage.");
                activo = false; 
                break;
            default: alert("Opción no válida."); break;
        }
    }
}

// =============================================================================
// INICIO DEL PROGRAMA
// =============================================================================
// Ya no llamamos a mostrarMenu() porque usamos botones y formularios en el HTML.
// Pero inicializamos la tabla para mostrar los datos actuales.

document.addEventListener("DOMContentLoaded", () => {
    renderizarTabla();
});


/* 
=============================================================================
EXPLICACIÓN DETALLADA PARA SUSTENTACIÓN
=============================================================================

1. VARIABLES Y CONSTANTES:
   Usamos 'let' para el arreglo porque su contenido cambiará. Usamos 'const' 
   dentro de las funciones para valores que no cambian en ese bloque.

2. ARREGLOS Y OBJETOS:
   El arreglo 'empleados' es el contenedor. Cada 'empleado' es un objeto {} que 
   permite agrupar propiedades (nombre, cargo) bajo una sola variable.

3. LOCAL STORAGE:
   Es la clave para que los datos no se borren. Guardamos texto (strings) 
   usando JSON.stringify y recuperamos objetos usando JSON.parse.

4. MÉTODOS DE ARREGLOS:
   - push(): Inserta un nuevo empleado.
   - find(): Localiza un empleado específico.
   - some(): Revisa si un valor ya existe (ideal para evitar duplicados).
   - length: Nos da el tamaño actual de la base de datos.

5. CICLO WHILE:
   Permite que el menú sea infinito hasta que el usuario decida manualmente 
   romper la condición (activo = false).

=============================================================================
BANCO DE PREGUNTAS (INSTRUCTOR SENA)
=============================================================================

1. ¿Qué es localStorage y para qué sirvió en este proyecto?
   R: Es una API del navegador que permite guardar datos en el disco duro de 
      forma persistente, logrando que la información no se borre al actualizar.

2. ¿Cuál es la función de JSON.stringify()?
   R: Convierte un objeto o arreglo de JavaScript en una cadena de texto, 
      ya que el localStorage solo acepta texto.

3. ¿Y JSON.parse()?
   R: Realiza el proceso inverso: convierte un texto (string) en un objeto 
      válido para que podamos manipularlo con JavaScript.

4. ¿Para qué se usó el método .some()?
   R: Para validar si ya existe un empleado con la misma identificación antes 
      de guardarlo, evitando datos repetidos.

5. ¿Qué significa "Modularizar" el código?
   R: Dividir el programa en funciones independientes (registrar, buscar, etc.) 
      para que sea más fácil de leer, probar y mantener.

6. ¿Por qué usamos parseFloat() en el salario?
   R: Porque los datos que vienen del prompt() son siempre texto. parseFloat 
      los convierte en números decimales para cálculos.

7. ¿Qué sucede si el usuario presiona "Cancelar" en el prompt?
   R: El valor recibido es 'null'. El código tiene validaciones 'if (seleccion === null)' 
      para evitar errores y cerrar el programa correctamente.

8. ¿Cómo formateas el salario para que se vea con separadores de miles?
   R: Usando el método .toLocaleString() en el valor numérico.

9. ¿Qué ventaja tiene usar for...of sobre un ciclo for tradicional?
   R: Es más limpio y legible cuando queremos recorrer todos los elementos de 
      un arreglo de principio a fin.

10. ¿Por qué el arreglo 'empleados' se declara fuera de las funciones?
    R: Para que tenga alcance global y todas las funciones puedan leer y modificar 
       el mismo conjunto de datos.

11. ¿Qué es el "Scope" o alcance de una variable?
    R: Es la zona del código donde una variable existe. Una variable declarada 
       dentro de una función solo existe allí (Scope local).

12. ¿Para qué sirve el método .trim()?
    R: Para limpiar los espacios en blanco accidentales que el usuario pueda 
       meter antes o después de un texto.

13. ¿Qué pasaría si no usamos "use strict"?
    R: El navegador sería más permisivo y podría dejar que usemos variables 
       mal declaradas, lo cual genera errores difíciles de encontrar.

14. ¿Cómo sabes cuántos empleados hay registrados en cualquier momento?
    R: Consultando la propiedad empleados.length.

15. ¿Qué hace el método .removeItem() del localStorage?
    R: Borra una clave específica de la memoria permanente; lo usamos para 
       la opción de "Borrar Base de Datos".

16. ¿Por qué usamos estructuras de control switch?
    R: Porque es más elegante y eficiente que usar muchos "if...else if" 
       cuando tenemos varias opciones fijas en un menú.

17. ¿Cómo se define un "Objeto Literal" en tu código?
    R: Como el nuevoEmpleado = { clave: valor }.

18. ¿Qué es un callback? (en el caso de .find o .some)
    R: Es la función que le pasamos al método `(emp => emp.id === id)` para 
       que se ejecute mientras recorre el arreglo.

19. ¿El sistema funciona sin internet?
    R: Sí, totalmente, porque todo se ejecuta en el navegador del cliente y 
       el almacenamiento es local al equipo.

20. ¿Qué mejorarías en una versión 2.0?
    R: Podría agregar la opción de Editar empleados existentes o eliminar uno 
       por uno en lugar de borrar todo.
*/
