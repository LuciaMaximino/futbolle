# Futbolle
Juego para adivinar un jugador de fútbol secreto. Proyecto final individual de la materia Desarrollo y Arquitecturas Web.

## Cómo se juega
1. Al ingresar, se te pide un nombre para identificarte durante la partida (mínimo 3 letras).
2. Escribí el nombre de un jugador de fútbol en el buscador y seleccionalo de la lista de sugerencias.
3. Por cada intento vas a ver una pista visual por atributo:
   - Verde: el atributo coincide con el jugador secreto.
   - Rojo: el atributo no coincide (nacionalidad, club, posición).
   - Flecha hacia arriba o abajo: el jugador secreto tiene un valor mayor o menor (edad, overall, altura).
4. Tenés 8 intentos para adivinar el nombre del jugador secreto.
5. Si acertás, ganás. Si agotás los intentos, perdés y se revela el jugador secreto.
6. Podés reiniciar la partida en cualquier momento sin recargar la página.

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
├── js/
│   ├── api.js
│   ├── dom.js
│   ├── game.js
│   └── contacto.js
└── img/
```

## Endpoints utilizados
Dataset de jugadores dado por la cátedra:
- `GET /api/players/search?q=&limit=8`: autocompletado de nombres.
- `GET /api/players/random`: jugador secreto aleatorio.

## Demo
Link del juego: https://luciamaximino.github.io/futbolle/

## Alumna
Lucía Maximino