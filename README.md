# ⚽ Fútbol Explorer

Tablas de posiciones de las mejores ligas del mundo usando la API pública de ESPN.

## Requisitos

- Node.js 18 o superior

## Cómo correr el proyecto

```bash
npm install     # solo la primera vez (instala dependencias)
npm run dev     # inicia el servidor de desarrollo
```

Abre en tu navegador: **http://localhost:5173**

## Cómo pararlo

En la terminal donde corre `npm run dev`, presiona `Ctrl + C`.

## Estructura del proyecto

```
src/
├── data/
│   └── leagues.js          → las 5 ligas (datos separados de la UI)
├── components/
│   ├── Header.jsx          → encabezado de la app
│   └── LeagueNav.jsx       → tabs de selección de liga
├── App.jsx                 → componente raíz, compone todo
├── main.jsx                → punto de entrada
└── index.css               → carga de Tailwind CSS
```

## Stack

- Vite
- React
- Tailwind CSS v4