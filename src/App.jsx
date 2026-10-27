import { useState } from 'react'
import Header from './components/Header'
import LeagueNav from './components/LeagueNav'
import StandingsTable from './components/StandingsTable'
import { leagues } from './data/leagues'

function App() {
  const [activeLeague, setActiveLeague] = useState('eng.1')

  return (
    <div>
      <Header />
      <div className="p-6">
        <LeagueNav leagues={leagues} active={activeLeague} onSelect={setActiveLeague} />
        <StandingsTable leagueId={activeLeague} />
      </div>
    </div>
  )
}

export default App