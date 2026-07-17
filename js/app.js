// ===== VECTOR PRINCIPAL DE PRODUCTOS =====
// Aquí tengo todos los productos disponibles con: codigo, precio, descripcion
// El profe nos pidió que usemos vectores bidimensionales
const productos = [
            //cod precio descripcion
            // [0] [1] [2]
            ["0001", 3500, "Sistema Web Personalizado"],
            ["0002", 500, "Computador Core I7"],
            ["0003", 200, "Monitor LG 20 pulgadas"],
            ["0004", 300, "Telefono Celular Samsung"],
            ["0005", 200, "Camara profesional Web."],
            ["0006", 150, "Servicio de Mantenimiento Anual"],
            ["0007", 100, "Servicio de Hosting Web (1 año)"],
            ["0008", 250, "Licencia Software Antivirus (1 año)"],
            ["0009", 400, "Impresora Multifuncional HP"],
            ["0010", 120, "Router Inalámbrico TP-Link"],
            ["0011", 180, "Teclado Mecánico RGB"],
            ["0012", 90, "Mouse Óptico USB"],
            ["0013", 75, "Audífonos con Micrófono"],
            ["0014", 60, "Disco Duro Externo 1TB"],
            ["0015", 45, "Memoria USB 64GB"],
            ["0016", 250, "Tablet Android 10 pulgadas"],
            ["0017", 300, "Smartwatch Deportivo"],
            ["0018", 400, "Proyector Multimedia HD"],
            ["0019", 150, "Cámara de Seguridad IP"],
            ["0020", 80, "Soporte para Laptop Ajustable"]
        ]

        // ===== 4 VECTORES PARA GUARDAR LA FACTURA =====
        // El ingeniero nos pidió usar 4 vectores separados en vez de 1 solo
        // Cada posición i de todos los vectores pertenece al mismo producto
        const codigosFactura = [] // Guardo los códigos: ["0001", "0003",...]
        const cantidadesFactura = [] // Guardo las cantidades: [2, 1,...]
        const preciosFactura = [] // Guardo los precios unitarios: [3500, 200,...]
        const totalesFactura = [] // Guardo el total por línea: cantidad * precio
        // ================================================

        // ===== CAPTURAR ELEMENTOS DEL HTML =====
        // Guardo en variables todos los input y botones para usarlos después
        const selectProducto = document.getElementById('id-select-producto')
        const txtCantidad = document.getElementById('id-txt-cantidad')
        const txtPrecio = document.getElementById('id-txt-precio')
        const txtTotal = document.getElementById('id-txt-total')
        const btnAgregar = document.getElementById('id-btn-agregar')
        const tablaDetalle = document.querySelector('#id-table-detalle tbody')

        // Cajas donde muestro los totales finales
        const txtSubtotal = document.getElementById('id-txt-subtotal')
        const txtIva = document.getElementById('id-txt-iva')
        const txtDescuento = document.getElementById('id-txt-descuento')
        const txtTotalPagar = document.getElementById('id-txt-total-pagar')

// Al iniciar la página cargo todos los productos al select
cargarProductos()

// ===== EVENTO: CUANDO CAMBIO DE PRODUCTO =====
// Cuando el usuario elige un producto del select
selectProducto.addEventListener('change', function (e) {
    const precio = parseFloat(e.target.value) // Saco el precio del value
    const cantidad = parseFloat(txtCantidad.value) || 1 // Si no hay cantidad pongo 1
    const total = Number(cantidad * precio).toFixed(2) // Calculo total de la línea

    // Muestro precio y total en las cajas de solo lectura
    txtPrecio.value = precio.toFixed(2)
    txtTotal.value = total
    txtCantidad.focus() // Mando el cursor a cantidad para que sea más rápido
})

// ===== EVENTO: CUANDO CAMBIO LA CANTIDAD =====
// Si el usuario cambia la cantidad también recalculo el total
txtCantidad.addEventListener('change', function (e) {
    const cantidad = parseFloat(e.target.value) || 0
    const precio = parseFloat(txtPrecio.value) || 0
    const total = Number(cantidad * precio).toFixed(2)
    txtTotal.value = total
})

// ===== CONSTANTES DEL EJERCICIO =====
const DESCUENTO_FIJO = 150.00; // Descuento fijo de $150 que pide el enunciado
const IVA = 0.15; // IVA del 15%

// ===== EVENTO: BOTON AGREGAR PRODUCTO =====
btnAgregar.addEventListener('click', function (e){
    // Saco todos los datos del formulario
    const codigo = selectProducto.options[selectProducto.selectedIndex].dataset.codigo;
    const cantidad = parseInt(txtCantidad.value);
    const precio = parseFloat(txtPrecio.value);
    const total = parseFloat(txtTotal.value);

    // VALIDACIÓN: No dejar agregar si no eligió producto o cantidad es menor a 1
    if(codigo === undefined || cantidad < 1 || isNaN(precio)){
        alert("Seleccione un producto y una cantidad valida mayor a 0");
        return;
    }

    // LÓGICA PARA EVITAR PRODUCTOS DUPLICADOS
    // Busco si ese código ya existe en el vector codigosFactura
    // findIndex devuelve la posición o -1 si no lo encuentra
    const indice = codigosFactura.findIndex(function(item) { return item === codigo; });

    if(indice!== -1){
        // SI YA EXISTE: Solo le sumo la cantidad nueva y recalculo el total de esa línea
        cantidadesFactura[indice] = cantidadesFactura[indice] + cantidad;
        totalesFactura[indice] = cantidadesFactura[indice] * preciosFactura[indice];
    } else {
        // SI NO EXISTE: Agrego los 4 datos en la misma posición de los 4 vectores
        codigosFactura.push(codigo);
        cantidadesFactura.push(cantidad);
        preciosFactura.push(precio);
        totalesFactura.push(total);
    }

    // Después de agregar actualizo todo
    mostrarTabla(); // Pinto la tabla
    calcularTotales(); // Recalculo subtotal, iva, total
    limpiarFormulario(); // Dejo el formulario limpio para el siguiente
})

// ===== FUNCIÓN: OBTENER DESCRIPCIÓN =====
// Como solo guardo el código en el vector, con esta función busco la descripción
function getDescripcion(codigo){
    for(let i = 0; i < productos.length; i++){
        if(productos[i][0] === codigo){ // Comparo con la posición 0 que es el código
            return productos[i][2]; // Retorno la posición 2 que es la descripción
        }
    }
    return "";
}

// ===== FUNCIÓN: MOSTRAR TABLA =====
// Recorro los 4 vectores y voy pintando cada fila en la tabla
function mostrarTabla(){
    tablaDetalle.innerHTML = ""; // Primero limpio la tabla

    // Si no hay productos muestro el mensaje
    if(codigosFactura.length === 0){
        tablaDetalle.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay productos en la factura</td></tr>';
        return;
    }

    // Recorro con el mismo indice i los 4 vectores
    for(let i = 0; i < codigosFactura.length; i++){
        const descripcion = getDescripcion(codigosFactura[i]); // Busco la descripción

        // Voy concatenando cada fila a la tabla
        tablaDetalle.innerHTML = tablaDetalle.innerHTML +
            '<tr>' +
                '<td>' + codigosFactura[i] + '</td>' +
                '<td>' + descripcion + '</td>' +
                '<td>' + preciosFactura[i].toFixed(2) + '</td>' +
                '<td>' + cantidadesFactura[i] + '</td>' +
                '<td>' + totalesFactura[i].toFixed(2) + '</td>' +
                '<td><button class="btn-remove" onclick="eliminarProducto(' + i + ')">X</button></td>' +
            '</tr>';
    }
}

// ===== FUNCIÓN: ELIMINAR PRODUCTO =====
// Recibo el indice de la fila y elimino de los 4 vectores en esa posición
function eliminarProducto(indice){
    codigosFactura.splice(indice, 1); // splice elimina 1 elemento en esa posición
    cantidadesFactura.splice(indice, 1);
    preciosFactura.splice(indice, 1);
    totalesFactura.splice(indice, 1);

    // Vuelvo a pintar y recalcular
    mostrarTabla();
    calcularTotales();
}

// ===== FUNCIÓN: CALCULAR TOTALES =====
// Aquí saco subtotal, iva, descuento y total a pagar
function calcularTotales(){
    let subtotal = 0;
    // Sumo todos los valores del vector totalesFactura
    for(let i = 0; i < totalesFactura.length; i++){
        subtotal = subtotal + totalesFactura[i];
    }
    const valorIva = subtotal * IVA; // 15% del subtotal
    const totalPagar = subtotal + valorIva - DESCUENTO_FIJO; // Fórmula final

    // Muestro todo en pantalla con 2 decimales y signo $
    txtSubtotal.innerHTML = "$" + subtotal.toFixed(2);
    txtIva.innerHTML = "$" + valorIva.toFixed(2);
    txtDescuento.innerHTML = "$" + DESCUENTO_FIJO.toFixed(2);
    txtTotalPagar.innerHTML = "$" + totalPagar.toFixed(2);
}

// ===== FUNCIÓN: LIMPIAR FORMULARIO =====
function limpiarFormulario(){
    selectProducto.selectedIndex = 0; // Vuelvo a "Seleccione un producto"
    txtCantidad.value = "1"; // Cantidad en 1 por defecto
    txtPrecio.value = "0.00"; // Precio en 0
    txtTotal.value = "0.00"; // Total en 0
}

// ===== FUNCIÓN: CARGAR PRODUCTOS AL SELECT =====
// Recorro el vector productos y creo un option por cada uno
function cargarProductos() {
    selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
    for (let i in productos) {
        const codigo = productos[i][0] // posición 0
        const precio = productos[i][1] // posición 1
        const descripcion = productos[i][2] // posición 2

        const option = document.createElement('option')
        option.value = precio // en el value guardo el precio para calcularlo rápido
        option.dataset.codigo = codigo // en data-codigo guardo el código
        option.textContent = descripcion // lo que ve el usuario

        selectProducto.appendChild(option)
    }
}

// ===== FUNCIÓN NUEVA: GENERAR PDF =====
// Esta función se ejecuta cuando le doy click al botón "Descargar PDF"
document.getElementById('id-btn-pdf').addEventListener('click', function() {
    // VALIDACIÓN: Si no hay productos no dejo generar PDF
    if(codigosFactura.length === 0){
        alert("Agrega productos a la factura antes de generar el PDF");
        return;
    }

    // Creo el documento PDF usando jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // ===== CABECERA DEL PDF =====
    doc.setFontSize(18);
    doc.text("FACTURA ELECTRONICA", 105, 20, {align: "center"});
    doc.setFontSize(10);
    doc.text("TechSolutions S.A.", 105, 27, {align: "center"});
    doc.text("RUC: 0999999001 | Guayaquil", 105, 32, {align: "center"});
    doc.text("Factura: #FAC-2025-0142", 14, 45);
    doc.text("Fecha: 27/10/2025", 14, 50);
    doc.text("Cliente: Empresa ABC Corp.", 14, 55);

    // ===== DETALLE DE PRODUCTOS EN EL PDF =====
    let y = 65; // variable y para ir bajando línea por línea
    doc.setFontSize(11);
    doc.text("DETALLE DE PRODUCTOS", 14, y);
    y = y + 8;

    // Encabezados de la tabla
    doc.setFontSize(9);
    doc.text("COD", 14, y);
    doc.text("DESCRIPCION", 35, y);
    doc.text("CANT", 115, y);
    doc.text("P.UNIT", 140, y);
    doc.text("TOTAL", 170, y);
    y = y + 4;
    doc.line(14, y, 196, y); // dibujo una línea
    y = y + 6;

    // Recorro los 4 vectores para pintar cada producto en el PDF
    for(let i = 0; i < codigosFactura.length; i++){
        const descripcion = getDescripcion(codigosFactura[i]);
        doc.text(codigosFactura[i], 14, y);
        doc.text(descripcion.substring(0, 28), 35, y); // corto descripción si es muy larga
        doc.text(cantidadesFactura[i].toString(), 115, y);
        doc.text("$" + preciosFactura[i].toFixed(2), 140, y);
        doc.text("$" + totalesFactura[i].toFixed(2), 170, y);
        y = y + 7;

        // Si me paso de la página creo una nueva
        if(y > 270){
            doc.addPage();
            y = 20;
        }
    }

    // ===== TOTALES EN EL PDF =====
    y = y + 5;
    doc.line(14, y, 196, y);
    y = y + 8;
    doc.text("SUBTOTAL: " + txtSubtotal.innerHTML, 140, y);
    y = y + 7;
    doc.text("IVA 15%: " + txtIva.innerHTML, 140, y);
    y = y + 7;
    doc.text("DESCUENTO: " + txtDescuento.innerHTML, 140, y);
    y = y + 7;
    doc.setFontSize(12);
    doc.text("TOTAL A PAGAR: " + txtTotalPagar.innerHTML, 140, y);

    // ===== DESCARGAR EL ARCHIVO =====
    doc.save("Factura_UNEMI.pdf"); // Se descarga con este nombre
});