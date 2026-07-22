'use strict';
var jugadorSecreto = null;
var intentosRestantes = 8;
var nombresIntentados = [];
var juegoTerminado = false;
var segundosTranscurridos = 0;
var idIntervaloTimer = null;
var nombreJugadorHumano = '';
var dificultadSeleccionada = 'facil';
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
    var puntaje = calcularPuntaje(nombresIntentados.length);
    juegoTerminado = true;
    detenerTimer();
    reproducirSonidoVictoria();
    guardarPartidaEnHistorial('Ganó', nombresIntentados.length, puntaje);
    mensajeGanar.textContent = 'Ganaste! Adivinaste al jugador en ' + nombresIntentados.length + ' intentos. Puntaje: ' + puntaje + '.';
    mostrarModal(modalGanar);
}
function finalizarJuegoPerdido() {
    juegoTerminado = true;
    detenerTimer();
    reproducirSonidoDerrota();
    guardarPartidaEnHistorial('Perdió', nombresIntentados.length, 0);
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
    if (hayAciertoEnComparacion(comparacion)) {
        reproducirSonidoAcierto();
    }
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
    dificultadSeleccionada = selectDificultad.value;
    mensajeErrorNombre.classList.add('oculto');
    ocultarModal(modalNombre);
    inicializarJuego();
}
function inicializarPantallaNombre() {
    botonComenzar.addEventListener('click', manejarClickComenzar);
}
window.addEventListener('load', inicializarPantallaNombre);
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
function obtenerHistorialGuardado() {
    var historialTexto = localStorage.getItem('historialFutbolle');
    if (historialTexto === null) {
        return [];
    }
    return JSON.parse(historialTexto);
}
function guardarPartidaEnHistorial(resultado, cantidadIntentos, puntaje) {
    var historial = obtenerHistorialGuardado();
    var duracionSegundos = segundosTranscurridos;
    var partida = {};
    partida.jugador = nombreJugadorHumano;
    partida.resultado = resultado;
    partida.intentos = cantidadIntentos;
    partida.fecha = new Date().toLocaleString();
    partida.duracion = duracionSegundos;
    partida.puntaje = puntaje;
    historial.push(partida);
    localStorage.setItem('historialFutbolle', JSON.stringify(historial));
}
function manejarClickVerHistorial() {
    var historial = obtenerHistorialGuardado();
    renderizarHistorial(historial);
    mostrarModal(modalHistorial);
}
function manejarClickCerrarHistorial() {
    ocultarModal(modalHistorial);
}
function ordenarPorFecha(partidaA, partidaB) {
    return new Date(partidaA.fecha) - new Date(partidaB.fecha);
}
function ordenarPorIntentos(partidaA, partidaB) {
    return partidaA.intentos - partidaB.intentos;
}
function manejarClickOrdenarFecha() {
    var historial = obtenerHistorialGuardado();
    historial.sort(ordenarPorFecha);
    renderizarHistorial(historial);
}
function manejarClickOrdenarIntentos() {
    var historial = obtenerHistorialGuardado();
    historial.sort(ordenarPorIntentos);
    renderizarHistorial(historial);
}
function inicializarHistorial() {
    botonVerHistorial.addEventListener('click', manejarClickVerHistorial);
    botonCerrarHistorial.addEventListener('click', manejarClickCerrarHistorial);
    botonOrdenarFecha.addEventListener('click', manejarClickOrdenarFecha);
    botonOrdenarIntentos.addEventListener('click', manejarClickOrdenarIntentos);
}
window.addEventListener('load', inicializarHistorial);
var contextoAudio = null;
function obtenerContextoAudio() {
    if (contextoAudio === null) {
        contextoAudio = new AudioContext();
    }
    return contextoAudio;
}
function reproducirTono(frecuencia, duracionMs) {
    var contexto = obtenerContextoAudio();
    var oscilador = contexto.createOscillator();
    var ganancia = contexto.createGain();
    oscilador.frequency.value = frecuencia;
    oscilador.connect(ganancia);
    ganancia.connect(contexto.destination);
    ganancia.gain.setValueAtTime(0.2, contexto.currentTime);
    ganancia.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + duracionMs / 1000);
    oscilador.start();
    oscilador.stop(contexto.currentTime + duracionMs / 1000);
}
function reproducirSonidoAcierto() {
    reproducirTono(880, 150);
}
function reproducirSonidoVictoria() {
    reproducirTono(660, 300);
}
function reproducirSonidoDerrota() {
    reproducirTono(220, 400);
}
function hayAciertoEnComparacion(comparacion) {
    if (comparacion.nacionalidad === 'correcto') {
        return true;
    }
    if (comparacion.club === 'correcto') {
        return true;
    }
    if (comparacion.posicion === 'correcto') {
        return true;
    }
    if (comparacion.edad === 'correcto') {
        return true;
    }
    if (comparacion.overall === 'correcto') {
        return true;
    }
    if (comparacion.altura === 'correcto') {
        return true;
    }
    return false;
}
function obtenerPuntosBase() {
    if (dificultadSeleccionada === 'facil') {
        return 60;
    }
    if (dificultadSeleccionada === 'medio') {
        return 80;
    }
    return 100;
}
function obtenerBonusTiempo() {
    if (segundosTranscurridos < 60) {
        return 20;
    }
    if (segundosTranscurridos < 120) {
        return 10;
    }
    return 0;
}
function calcularPuntaje(cantidadIntentos) {
    var puntosBase = obtenerPuntosBase();
    var penalizacionIntentos = (cantidadIntentos - 1) * 10;
    var bonusTiempo = obtenerBonusTiempo();
    var puntaje = puntosBase - penalizacionIntentos + bonusTiempo;
    if (puntaje < 10) {
        return 10;
    }
    return puntaje;
}