// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Carga las opciones de bodegas y monedas desde la API
  cargarSelects();

  // Escucha cambios en el select de bodega para cargar sucursales relacionadas
  document.getElementById("bodega").addEventListener("change", cargarSucursales);

  // Intercepta el envío del formulario para validación previa
  document.getElementById("form-producto").addEventListener("submit", validarFormulario);
});

//Cargas las opciones de bodegas y monedas desde la API

function cargarSelects(){
    fetch("api/cargar-selects.php?tipo=bodegas")
    .then(res => res.json())
    .then(data => llenarSelect("bodega", data) );

    fetch("api/cargar-selects.php?tipo=monedas")
    .then(res => res.json())
    .then(data => llenarSelect("moneda", data) );
}

//Carga las sucursales según la bodega seleccionada
function cargarSucursales(){

    const bodegaId = document.getElementById("bodega").value;

    //Si no hay bodega seleccionada, limpiar sucursales
    if (!bodegaId){

        llenarSelect("sucursal",[]);
        return;
    }

    fetch(`api/cargar-selects.php?tipo=sucursales&bodega_id=${bodegaId}`)
    .then(res => res.json() )
    .then(data => llenarSelect("sucursal",data) );

}

//Rellenar un select con opciones desde un array de objetos

function llenarSelect(id,data){
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Seleccione una opción</option>';
    data.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.id;
        option.textContent = opt.nombre;
        select.appendChild(option);
    
    });
}

//Validación del formulario antes de enviarlo

function validarFormulario(e){
    e.preventDefault();//Evita el envío automatico

    //Capturar valores del formulario en constantes

    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const precio = document.getElementById("precio").value.trim()
    const descripcion = document.getElementById("descripcion").value.trim();
    const materiales = Array.from(document.querySelectorAll("input[name='materiales[]']:checked")).map(el => el.value);
    const bodega = document.getElementById("bodega").value.trim();
    const sucursal = document.getElementById("sucursal").value.trim();
    const moneda = document.getElementById("moneda").value.trim();

    //Expresiones reguales o REGEX

    const regexCodigo = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/;
    const regexPrecio = /^\d+(\.\d{1,2})?$/;

    //Validaciones personalizadas con mensajes personalizados

    if (!codigo) return alert("El código del producto no puede estar en blanco.");
    if (!regexCodigo.test(codigo)) return alert("El código debe tener letras y números y entre 5 y 15 caracteres.");

    if (!nombre) return alert("El nombre del producto no puede estar en blanco.");
    if (nombre.length < 2 || nombre.length > 50) return alert("El nombre debe tener entre 2 y 50 caracteres.");

    if (!precio) return alert("El precio no puede estar en blanco.");
    if (!regexPrecio.test(precio)) return alert("El precio debe ser un número positivo con hasta dos decimales.");

    if (materiales.length < 2) return alert("Debe seleccionar al menos dos materiales.");

    if (!bodega) return alert("Debe seleccionar una bodega.");
    if (!sucursal) return alert("Debe seleccionar una sucursal.");
    if (!moneda) return alert("Debe seleccionar una moneda.");

    if (!descripcion) return alert("La descripción no puede estar en blanco.");
    if (descripcion.length < 10 || descripcion.length > 1000) return alert("La descripción debe tener entre 10 y 1000 caracteres.");

    //Si se realizan todas las validades, se prepara el formulario

    const form = document.getElementById("form-producto");
    const formData = new FormData(form);

    //Enviar por medio de fetch a guardar.php

    fetch("guardar.php",{
        method: "POST",
        body: formData
    })
    .then ( res => res.text())
    .then (msg => {
        alert(msg);
        form.reset();
    })
    .catch(err => {
        console.error("Error al guardar",err);
        alert("Ocurrio un error al guardar el producto");

    });
}