'use strict';
var jugadorSecreto = null;
var intentosRestantes = 8;
var nombresIntentados = [];
var juegoTerminado = false;
var segundosTranscurridos = 0;
var idIntervaloTimer = null;
var nombreJugadorHumano = '';
function reiniciarEstadoJuego() {
    jugadorSecreto = null;
    intentosRestantes = 8;
    nombresIntentados = [];
    juegoTerminado = false;
    segundosTranscurridos = 0;
}
function reiniciarVista() {
    limpiarTableroVisual();
    actualizarContadorIntentos();
    actualizarMostrarTiempo();
}
function inicializarJuego() {
    detenerTimer();
    reiniciarEstadoJuego();
    reiniciarVista();
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
function manejarClickFueraBusqueda(evento) {
    var clickDentroInput = evento.target === inputJugador;
    var clickDentroLista = listaSugerencias.contains(evento.target);
    if (!clickDentroInput && !clickDentroLista) {
        ocultarListaSugerencias();
    }
}
function inicializarBusqueda() {
    inputJugador.addEventListener('input', manejarEntradaBusqueda);
    document.addEventListener('click', manejarClickFueraBusqueda);
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
    detenerTimer();
    mensajeGanar.textContent = 'Ganaste! Adivinaste al jugador en ' + nombresIntentados.length + ' intentos.';
    mostrarModal(modalGanar);
}
function finalizarJuegoPerdido() {
    juegoTerminado = true;
    detenerTimer();
    mensajePerder.textContent = 'Perdiste. El jugador secreto era ' + jugadorSecreto.name + '.';
    mostrarModal(modalPerder);
}
function registrarIntento(jugador) {
    var yaIntentado = nombresIntentados.indexOf(jugador.name) !== -1;
    var esPrimerIntento = nombresIntentados.length === 0;
    var comparacion = null;
    if (juegoTerminado) {
        return;
    }
    if (yaIntentado) {
        mensajeError.textContent = 'Ya intentaste con ese jugador, probá con otro.';
        mostrarModal(modalError);
        return;
    }
    if (esPrimerIntento) {
        iniciarTimer();
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
function formatearNumeroDosDigitos(numero) {
    if (numero < 10) {
        return '0' + numero;
    }
    return String(numero);
}
function actualizarMostrarTiempo() {
    var minutos = Math.floor(segundosTranscurridos / 60);
    var segundos = segundosTranscurridos % 60;
    mostrarTiempo.textContent = 'Tiempo: ' + formatearNumeroDosDigitos(minutos) + ':' + formatearNumeroDosDigitos(segundos);
}
function incrementarTiempo() {
    segundosTranscurridos = segundosTranscurridos + 1;
    actualizarMostrarTiempo();
}
function iniciarTimer() {
    if (idIntervaloTimer !== null) {
        return;
    }
    idIntervaloTimer = setInterval(incrementarTiempo, 1000);
}
function detenerTimer() {
    clearInterval(idIntervaloTimer);
    idIntervaloTimer = null;
}
function manejarClickReiniciar() {
    inicializarJuego();
}
function inicializarBotonReiniciar() {
    botonReiniciar.addEventListener('click', manejarClickReiniciar);
}
window.addEventListener('load', inicializarBotonReiniciar);
function validarNombreJugador(nombre) {
    return nombre.trim().length >= 3;
}
function manejarClickComenzar() {
    var nombre = inputNombreJugador.value.trim();
    if (!validarNombreJugador(nombre)) {
        mensajeErrorNombre.textContent = 'El nombre debe tener al menos 3 letras.';
        mensajeErrorNombre.classList.remove('oculto');
        return;
    }
    nombreJugadorHumano = nombre;
    mensajeErrorNombre.classList.add('oculto');
    ocultarModal(modalNombre);
    inicializarJuego();
}
function inicializarPantallaNombre() {
    botonComenzar.addEventListener('click', manejarClickComenzar);
}
window.addEventListener('load', inicializarPantallaNombre);