'use strict';
var jugadorSecreto = null;
var intentosRestantes = 8;
var nombresIntentados = [];
function inicializarJuego() {
    obtenerJugadorAleatorio(manejarJugadorObtenido, manejarErrorApi);
}
function manejarJugadorObtenido(jugador) {
    jugadorSecreto = jugador;
    console.log('Jugador secreto:', jugadorSecreto);
}
function manejarErrorApi(error) {
    console.error('Error al consultar el servidor', error);
}
window.addEventListener('load', inicializarJuego);