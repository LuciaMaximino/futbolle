'use strict';
var jugadorSecreto = null;
var intentosRestantes = 8;
var nombresIntentados = [];
var juegoTerminado = false;
function inicializarJuego() {
    obtenerJugadorAleatorio(manejarJugadorObtenido, manejarErrorApi);
}
function manejarJugadorObtenido(jugador) {
    jugadorSecreto = jugador;
    console.log('Jugador secreto:', jugadorSecreto);
}
function manejarErrorApi(error) {
    console.error('Error al consultar el servidor', error);
    mensajeError.textContent = 'Hubo un problema al conectar con el servidor. Intentá de nuevo más tarde.';
    mostrarModal(modalError);
}
window.addEventListener('load', inicializarJuego);
function manejarEntradaBusqueda() {
    var texto = inputJugador.value.trim();
    if (texto.length < 2) {
        ocultarListaSugerencias();
        return;
    }
    buscarJugadores(texto, mostrarSugerencias, manejarErrorApi);
}
function seleccionarJugador(jugador) {
    inputJugador.value = '';
    ocultarListaSugerencias();
    registrarIntento(jugador);
}
function inicializarBusqueda() {
    inputJugador.addEventListener('input', manejarEntradaBusqueda);
}
window.addEventListener('load', inicializarBusqueda);
function compararIgualdad(valorIntento, valorSecreto) {
    if (valorIntento === valorSecreto) {
        return 'correcto';
    }
    return 'incorrecto';
}
function compararNumero(valorIntento, valorSecreto) {
    if (valorIntento === valorSecreto) {
        return 'correcto';
    }
    if (valorSecreto > valorIntento) {
        return 'mayor';
    }
    return 'menor';
}
function compararJugadores(intento, secreto) {
    var resultado = {};
    resultado.nacionalidad = compararIgualdad(intento.nationality, secreto.nationality);
    resultado.club = compararIgualdad(intento.club, secreto.club);
    resultado.posicion = compararIgualdad(intento.position, secreto.position);
    resultado.edad = compararNumero(intento.age, secreto.age);
    resultado.overall = compararNumero(intento.overall, secreto.overall);
    resultado.altura = compararNumero(intento.heightCm, secreto.heightCm);
    return resultado;
}
function actualizarContadorIntentos() {
    contadorIntentos.textContent = 'Intentos restantes: ' + intentosRestantes;
}
function finalizarJuegoGanado() {
    juegoTerminado = true;
    mensajeGanar.textContent = 'Ganaste! Adivinaste al jugador en ' + nombresIntentados.length + ' intentos.';
    mostrarModal(modalGanar);
}
function finalizarJuegoPerdido() {
    juegoTerminado = true;
    mensajePerder.textContent = 'Perdiste. El jugador secreto era ' + jugadorSecreto.name + '.';
    mostrarModal(modalPerder);
}
function registrarIntento(jugador) {
    var yaIntentado = nombresIntentados.indexOf(jugador.name) !== -1;
    var comparacion = null;
    if (juegoTerminado) {
        return;
    }
    if (yaIntentado) {
        mensajeError.textContent = 'Ya intentaste con ese jugador, probá con otro.';
        mostrarModal(modalError);
        return;
    }
    nombresIntentados.push(jugador.name);
    intentosRestantes = intentosRestantes - 1;
    comparacion = compararJugadores(jugador, jugadorSecreto);
    agregarFilaTablero(jugador, comparacion);
    actualizarContadorIntentos();
    if (jugador.name === jugadorSecreto.name) {
        finalizarJuegoGanado();
        return;
    }
    if (intentosRestantes === 0) {
        finalizarJuegoPerdido();
    }
}