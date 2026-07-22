'use strict';
var expresionNombre = /^[a-zA-Z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1\s]+$/;
var expresionMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var inputNombreContacto = document.getElementById('inputNombreContacto');
var inputMailContacto = document.getElementById('inputMailContacto');
var inputMensajeContacto = document.getElementById('inputMensajeContacto');
var errorNombreContacto = document.getElementById('errorNombreContacto');
var errorMailContacto = document.getElementById('errorMailContacto');
var errorMensajeContacto = document.getElementById('errorMensajeContacto');
var botonEnviarContacto = document.getElementById('botonEnviarContacto');
var botonTema = document.getElementById('botonTema');
function validarNombreContacto(nombre) {
    return nombre.trim().length > 0 && expresionNombre.test(nombre.trim());
}
function validarMailContacto(mail) {
    return expresionMail.test(mail.trim());
}
function validarMensajeContacto(mensaje) {
    return mensaje.trim().length > 5;
}
function mostrarErrorCampo(elementoError, mensaje) {
    elementoError.textContent = mensaje;
    elementoError.classList.remove('oculto');
}
function ocultarErrorCampo(elementoError) {
    elementoError.classList.add('oculto');
}
function limpiarFormularioContacto() {
    inputNombreContacto.value = '';
    inputMailContacto.value = '';
    inputMensajeContacto.value = '';
}
function abrirClienteMail(nombre, mail, mensaje) {
    var asunto = 'Contacto desde Futbolle - ' + nombre;
    var cuerpo = 'Nombre: ' + nombre + '\nMail: ' + mail + '\n\n' + mensaje;
    var urlMailto = 'mailto:?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    window.location.href = urlMailto;
    limpiarFormularioContacto();
}
function manejarClickEnviarContacto() {
    var nombre = inputNombreContacto.value;
    var mail = inputMailContacto.value;
    var mensaje = inputMensajeContacto.value;
    var esValido = true;
    if (!validarNombreContacto(nombre)) {
        mostrarErrorCampo(errorNombreContacto, 'El nombre debe ser alfanumérico.');
        esValido = false;
    } else {
        ocultarErrorCampo(errorNombreContacto);
    }
    if (!validarMailContacto(mail)) {
        mostrarErrorCampo(errorMailContacto, 'Ingresá un mail válido.');
        esValido = false;
    } else {
        ocultarErrorCampo(errorMailContacto);
    }
    if (!validarMensajeContacto(mensaje)) {
        mostrarErrorCampo(errorMensajeContacto, 'El mensaje debe tener más de 5 caracteres.');
        esValido = false;
    } else {
        ocultarErrorCampo(errorMensajeContacto);
    }
    if (esValido) {
        abrirClienteMail(nombre, mail, mensaje);
    }
}
function inicializarFormularioContacto() {
    botonEnviarContacto.addEventListener('click', manejarClickEnviarContacto);
}
window.addEventListener('load', inicializarFormularioContacto);
function manejarClickTema() {
    document.body.classList.toggle('temaClaro');
    if (document.body.classList.contains('temaClaro')) {
        botonTema.textContent = 'Modo oscuro';
        localStorage.setItem('temaFutbolle', 'claro');
    } else {
        botonTema.textContent = 'Modo claro';
        localStorage.setItem('temaFutbolle', 'oscuro');
    }
}
function aplicarTemaGuardado() {
    var temaGuardado = localStorage.getItem('temaFutbolle');
    if (temaGuardado === 'claro') {
        document.body.classList.add('temaClaro');
        botonTema.textContent = 'Modo oscuro';
    }
}
function inicializarBotonTema() {
    aplicarTemaGuardado();
    botonTema.addEventListener('click', manejarClickTema);
}
window.addEventListener('load', inicializarBotonTema);