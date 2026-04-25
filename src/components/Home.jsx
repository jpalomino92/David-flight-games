import './Home.css'
import { GAME_CATALOG } from '../features/home/gameCatalog'

function Home({ onSelectGame }) {
  return (
    <div className="home">
      <h1 className="home-title">David's PlayGround</h1>
      <div className="games-grid">
        {GAME_CATALOG.map((game) => (
          <button
            key={game.id}
            className="game-button"
            onClick={() => onSelectGame(game.id)}
          >
            <span className="game-emoji">{game.emoji}</span>
            <span className="game-name">{game.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
