import { useState } from 'react'
import Header from './components/Header'
import LeagueNav from './components/LeagueNav'
import { leagues } from './data/leagues'

function App() {
  const [activeLeague, setActiveLeague] = useState('eng.1')

  return (
    <div>
      <Header />
      <div className="p-6">
        <LeagueNav leagues={leagues} active={activeLeague} onSelect={setActiveLeague} />
        <p className="mt-4 text-slate-600">
          Liga seleccionada: <strong className="text-slate-900">{activeLeague}</strong>
        </p>
      </div>
    </div>
  )
}

export default App