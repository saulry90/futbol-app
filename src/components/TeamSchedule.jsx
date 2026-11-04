import { useId, useState } from 'react'
import MatchList from './MatchList'

const tabs = [
  { id: 'past', label: 'Últimos partidos' },
  { id: 'upcoming', label: 'Próximos partidos' },
  { id: 'stats', label: 'Estadísticas' },
]

function TeamSchedule({ leagueId, teamId, ourTeamName, ourTeamLogo }) {
  const [activeTab, setActiveTab] = useState('past')
  const baseId = useId()

  // Navegación con flechas
  function handleKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.id === activeTab)
    let nextIndex
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    else return

    event.preventDefault()
    const nextId = tabs[nextIndex].id
    setActiveTab(nextId)
    document.getElementById(`${baseId}-tab-${nextId}`)?.focus()
  }

  return (
    <div>
      <div role="tablist" onKeyDown={handleKeyDown} className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${baseId}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? 'px-3 py-2 text-sm font-semibold text-slate-900 border-b-2 border-green-600'
                : 'px-3 py-2 text-sm text-slate-500 hover:text-slate-700'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${activeTab}`}>
        {activeTab === 'stats' ? (
          <p className="mt-4 text-sm text-slate-500">Próximamente.</p>
        ) : (
          <MatchList
            key={activeTab}
            leagueId={leagueId}
            teamId={teamId}
            ourTeamName={ourTeamName}
            ourTeamLogo={ourTeamLogo}
            type={activeTab}
          />
        )}
      </div>
    </div>
  )
}

export default TeamSchedule
