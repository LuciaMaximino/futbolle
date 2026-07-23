# Futbolle
Juego para adivinar un jugador de fútbol secreto. Proyecto final individual de la materia Desarrollo y Arquitecturas Web.

## Cómo se juega
1. Al ingresar, se te pide un nombre para identificarte durante la partida, y podés elegir el nivel de dificultad: Fácil, Medio o Difícil.
2. Escribí el nombre de un jugador de fútbol en el buscador y seleccionalo de la lista de sugerencias.
3. Por cada intento vas a ver una pista visual por atributo:
   - Verde: el atributo coincide con el jugador secreto.
   - Rojo: el atributo no coincide (nacionalidad, club, posición).
   - Flecha hacia arriba o abajo: el jugador secreto tiene un valor mayor o menor (edad, overall, altura).
4. Tenés 8 intentos para adivinar el nombre del jugador secreto.
5. Si acertás, ganás y se calcula tu puntaje según la dificultad, los intentos usados y el tiempo. Si agotás los intentos, perdés y se revela el jugador secreto.
6. Podés reiniciar la partida en cualquier momento sin recargar la página.

## Niveles de dificultad
- **Fácil**: se muestra la foto del jugador secreto desenfocada, que se va aclarando con cada intento fallido hasta revelarse por completo al terminar la partida.
- **Medio**: se revelan de a poco datos del jugador (altura, edad, overall) a medida que se agotan intentos, aunque no se hayan adivinado.
- **Difícil**: sin pistas adicionales, solo el feedback de colores y flechas de cada intento.

## Sistema de puntuación
Al ganar una partida se calcula un puntaje = (puntos base según dificultad) − (intentos usados − 1) × 10 + bonus por tiempo.
- Puntos base: Fácil 60, Medio 80, Difícil 100.
- Bonus por tiempo: +20 si se ganó en menos de 60 segundos, +10 si se ganó en menos de 120 segundos, +0 en cualquier otro caso.
- El puntaje mínimo en una partida ganada es 10. Si se pierde, el puntaje registrado es 0.

## Funcionalidades adicionales
- Modo oscuro y modo claro.
- Sonidos al acertar un atributo, ganar o perder la partida.
- Historial de partidas jugadas (nombre, resultado, intentos, fecha, duración y puntaje), con opción de ordenar por fecha o por cantidad de intentos.

## Tecnologías utilizadas
- HTML5
- CSS3 (Flexbox)
- JavaScript (ES5)

## Estructura del proyecto
```
futbolle/
├── index.html
├── contacto.html
├── css/
│   ├── reset.css
│   └── styles.css
└── js/
    ├── api.js
    ├── dom.js
    ├── game.js
    └── contacto.js
```

## Endpoints utilizados
Dataset de jugadores dado por la cátedra:
- `GET /api/players/search?q=&limit=8`: autocompletado de nombres.
- `GET /api/players/random`: jugador secreto aleatorio.

## Demo
Link del juego: https://luciamaximino.github.io/futbolle/

## Alumna
Lucía Maximino