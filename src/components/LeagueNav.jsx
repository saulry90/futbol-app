function LeagueNav({ leagues, active, onSelect }) {
  return (
    <nav className="flex gap-2">
      {leagues.map((league) => (
        <button
          key={league.id}
          onClick={() => onSelect(league.id)}
          className={
            active === league.id
              ? 'px-4 py-2 bg-green-600 text-white rounded-md font-semibold'
              : 'px-4 py-2 bg-slate-200 text-slate-700 rounded-md'
          }
        >
          {league.name}
        </button>
      ))}
    </nav>
  )
}

export default LeagueNav