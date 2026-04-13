import './Home.css'

function Home({ onSelectGame }) {
  const games = [
    { id: 'touchGame', name: '🐶 ¿Dónde está el perro?', emoji: '🐶' },
    { id: 'beePath', name: '🐝 Camino de la abeja', emoji: '🐝' },
  ]

  return (
    <div className="home">
      <h1 className="home-title">David's PlayGround</h1>
      <div className="games-grid">
        {games.map((game) => (
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