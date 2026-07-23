'use strict';
var inputJugador = document.getElementById('inputJugador');
var listaSugerencias = document.getElementById('listaSugerencias');
var contadorIntentos = document.getElementById('contadorIntentos');
var mostrarTiempo = document.getElementById('mostrarTiempo');
var cuerpoTablero = document.getElementById('cuerpoTablero');
var botonReiniciar = document.getElementById('botonReiniciar');
var modalGanar = document.getElementById('modalGanar');
var mensajeGanar = document.getElementById('mensajeGanar');
var botonCerrarGanar = document.getElementById('botonCerrarGanar');
var modalPerder = document.getElementById('modalPerder');
var mensajePerder = document.getElementById('mensajePerder');
var botonCerrarPerder = document.getElementById('botonCerrarPerder');
var modalError = document.getElementById('modalError');
var mensajeError = document.getElementById('mensajeError');
var botonCerrarError = document.getElementById('botonCerrarError');
var modalNombre = document.getElementById('modalNombre');
var inputNombreJugador = document.getElementById('inputNombreJugador');
var mensajeErrorNombre = document.getElementById('mensajeErrorNombre');
var botonComenzar = document.getElementById('botonComenzar');
var botonTema = document.getElementById('botonTema');
var botonVerHistorial = document.getElementById('botonVerHistorial');
var modalHistorial = document.getElementById('modalHistorial');
var listaHistorial = document.getElementById('listaHistorial');
var botonCerrarHistorial = document.getElementById('botonCerrarHistorial');
var botonOrdenarFecha = document.getElementById('botonOrdenarFecha');
var botonOrdenarIntentos = document.getElementById('botonOrdenarIntentos');
var selectDificultad = document.getElementById('selectDificultad');
var seccionPistaFacil = document.getElementById('seccionPistaFacil');
var fotoJugadorSecreto = document.getElementById('fotoJugadorSecreto');
function mostrarModal(modal) {
    modal.classList.remove('oculto');
}
function ocultarModal(modal) {
    modal.classList.add('oculto');
}
function inicializarBotonesModales() {
    botonCerrarGanar.addEventListener('click', cerrarModalGanar);
    botonCerrarPerder.addEventListener('click', cerrarModalPerder);
    botonCerrarError.addEventListener('click', cerrarModalError);
}
function cerrarModalGanar() {
    ocultarModal(modalGanar);
}
function cerrarModalPerder() {
    ocultarModal(modalPerder);
}
function cerrarModalError() {
    ocultarModal(modalError);
}
window.addEventListener('load', inicializarBotonesModales);
function limpiarListaSugerencias() {
    while (listaSugerencias.firstChild) {
        listaSugerencias.removeChild(listaSugerencias.firstChild);
    }
}
function ocultarListaSugerencias() {
    limpiarListaSugerencias();
    listaSugerencias.classList.add('oculto');
}
function mostrarSugerencias(jugadores) {
    limpiarListaSugerencias();
    if (jugadores.length === 0) {
        listaSugerencias.classList.add('oculto');
        return;
    }
    for (var i = 0; i < jugadores.length; i++) {
        agregarItemSugerencia(jugadores[i]);
    }
    listaSugerencias.classList.remove('oculto');
}
function agregarItemSugerencia(jugador) {
    var item = document.createElement('li');
    var manejarClick = crearManejadorSeleccion(jugador);
    item.textContent = jugador.name;
    item.addEventListener('click', manejarClick);
    listaSugerencias.appendChild(item);
}
function crearManejadorSeleccion(jugador) {
    return function () {
        seleccionarJugador(jugador);
    };
}
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
function obtenerSimboloPista(resultado) {
    if (resultado === 'mayor') {
        return '\u25B2';
    }
    if (resultado === 'menor') {
        return '\u25BC';
    }
    return '';
}
function agregarCeldaNombre(fila, nombre) {
    var celda = document.createElement('span');
    celda.textContent = nombre;
    fila.appendChild(celda);
}
function agregarCeldaAtributo(fila, resultado) {
    var celda = document.createElement('span');
    celda.classList.add('celdaAtributo');
    celda.classList.add('pista' + capitalizar(resultado));
    celda.textContent = obtenerSimboloPista(resultado);
    fila.appendChild(celda);
}
function agregarFilaTablero(jugador, comparacion) {
    var fila = document.createElement('div');
    fila.className = 'filaTablero';
    agregarCeldaNombre(fila, jugador.name);
    agregarCeldaAtributo(fila, comparacion.nacionalidad);
    agregarCeldaAtributo(fila, comparacion.club);
    agregarCeldaAtributo(fila, comparacion.posicion);
    agregarCeldaAtributo(fila, comparacion.edad);
    agregarCeldaAtributo(fila, comparacion.overall);
    agregarCeldaAtributo(fila, comparacion.altura);
    cuerpoTablero.appendChild(fila);
}
function limpiarTableroVisual() {
    while (cuerpoTablero.firstChild) {
        cuerpoTablero.removeChild(cuerpoTablero.firstChild);
    }
}
function limpiarListaHistorial() {
    while (listaHistorial.firstChild) {
        listaHistorial.removeChild(listaHistorial.firstChild);
    }
}
function formatearDuracion(segundos) {
    var minutos = Math.floor(segundos / 60);
    var segundosRestantes = segundos % 60;
    return minutos + 'm ' + segundosRestantes + 's';
}
function agregarFilaHistorial(partida) {
    var fila = document.createElement('div');
    var textoFila = partida.jugador + ' - ' + partida.resultado + ' - ' + partida.intentos + ' intentos - ' + formatearDuracion(partida.duracion) + ' - ' + partida.fecha + ' - ' + partida.puntaje + ' pts';
    fila.className = 'filaHistorial';
    fila.textContent = textoFila;
    listaHistorial.appendChild(fila);
}
function renderizarHistorial(historial) {
    var i = 0;
    limpiarListaHistorial();
    if (historial.length === 0) {
        listaHistorial.textContent = 'Todavía no jugaste ninguna partida.';
        return;
    }
    for (i = 0; i < historial.length; i++) {
        agregarFilaHistorial(historial[i]);
    }
}
function quitarClasesBlur() {
    var nivel = 0;
    for (nivel = 0; nivel <= 7; nivel++) {
        fotoJugadorSecreto.classList.remove('blurNivel' + nivel);
    }
}
function actualizarNivelBlur(nivel) {
    quitarClasesBlur();
    fotoJugadorSecreto.classList.add('blurNivel' + nivel);
}
function manejarErrorCargaFoto() {
    seccionPistaFacil.classList.add('oculto');
}
function inicializarManejoErrorFoto() {
    fotoJugadorSecreto.addEventListener('error', manejarErrorCargaFoto);
}
window.addEventListener('load', inicializarManejoErrorFoto);
