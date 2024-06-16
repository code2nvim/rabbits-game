import Game from "./Game/Game";
import "./styles.css";

const App = () => {
  return (
    <div className="app">
      <header>
        <p>Rabbits Game</p>
      </header>
      <main>
        <Game />
      </main>
      <footer>
        <button className="gradient">TODO</button>
        <button className="gradient">TODO</button>
        <button className="gradient">TODO</button>
      </footer>
    </div>
  );
};

export default App;
