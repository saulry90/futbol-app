# ⚽ Fútbol Explorer

Tablas de posiciones de las mejores ligas del mundo usando la API pública de ESPN. Al hacer clic en un equipo se despliegan sus últimos partidos.

## Requisitos

- Node.js 20.19 o superior (o 22.12 o superior)

## Cómo correr el proyecto

```bash
npm install     # solo la primera vez (instala dependencias)
npm run dev     # inicia el servidor de desarrollo
```

Abre en tu navegador: **http://localhost:5173**

## Cómo pararlo

En la terminal donde corre `npm run dev`, presiona `Ctrl + C`.

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: genera la versión de producción
- `npm run preview`: sirve localmente la versión generada
- `npm run lint`: revisa el código con oxlint

## Estructura del proyecto

```
src/
├── services/
│   └── api.js              → llamadas a la API de ESPN
├── hooks/
│   ├── useStandings.js     → carga la tabla de una liga
│   └── useTeamSchedule.js  → carga los partidos de un equipo
├── data/
│   └── leagues.js          → las 5 ligas (datos separados de la UI)
├── utils/
│   └── matchHelpers.js     → formato de fechas y color del resultado
├── components/
│   ├── Header.jsx          → encabezado de la app
│   ├── LeagueNav.jsx       → tabs de selección de liga
│   ├── StandingsTable.jsx  → tabla de posiciones
│   └── TeamSchedule.jsx    → partidos de un equipo
├── App.jsx                 → componente raíz, compone todo
├── main.jsx                → punto de entrada
└── index.css               → carga de Tailwind CSS
```

## Stack

- Vite
- React
- Tailwind CSS v4
- oxlint
