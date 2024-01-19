import { useEffect, useState } from "react";
import "./Game.css";

// to avoid string typos
const hole = "hole";
const rabbit = "rabbit";
const carrot = "carrot";

export default function Game() {
  const [msg, setMsg] = useState("Attack the carrot thieves!");
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [targets, setTargets] = useState<Target[]>(new Array(9).fill(hole));
  type Target = "hole" | "rabbit" | "carrot";

  function startGame() {
    setScore(0);
    setPlaying(true);
    setTargets(new Array(9).fill(hole));
  }

  function endGame(failed: Target) {
    setTimeout(() => {
      if (failed === carrot) setMsg("Carrot's gone!");
      if (failed === rabbit) setMsg("It's an innocent rabbit!");
    }, 100);
    const holes = new Array(9).fill(hole);
    setTargets(holes);
    setPlaying(false);
  }

  function rabbitOut(idx: number) {
    setTargets((_targets) => {
      if (_targets[idx] === carrot) endGame(carrot);
      const newTargets = [..._targets];
      newTargets[idx] = hole;
      return newTargets;
    });
  }

  function changeTarget(idx: number, target: Target) {
    setTargets((_targets) => {
      const newTargets = [..._targets];
      newTargets[idx] = target;
      return newTargets;
    });
  }

  function randomThief(): Target {
    const rand = Math.floor(Math.random() * 2);
    return rand === 0 ? rabbit : carrot;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playing) {
        const idx = Math.floor(Math.random() * targets.length);
        if (targets[idx] === hole) {
          changeTarget(idx, randomThief());
          setTimeout(() => {
            rabbitOut(idx);
          }, 1500);
        }
      }
    }, 200);
    return () => clearInterval(intervalId);
  }, [targets]);

  function clickTarget(idx: number) {
    if (playing) {
      switch (targets[idx]) {
        case hole:
          break;
        case rabbit:
          endGame(rabbit);
          break;
        case carrot:
          changeTarget(idx, hole);
          setScore(score + 1);
          break;
        default:
          throw new Error("Unknown action");
      }
    }
  }

  function assets(target: Target): string {
    switch (target) {
      case carrot:
        return require("./assets/carrot.png");
      case hole:
        return require("./assets/hole.png");
      case rabbit:
        return require("./assets/rabbit.png");
      default:
        throw new Error("Unknown action");
    }
  }

  return (
    <>
      <div className="targets">
        {targets.map((target, idx) => {
          return (
            <div className="hole">
              <img
                src={assets(target)}
                alt="hole"
                onClick={() => clickTarget(idx)}
              />
            </div>
          );
        })}
      </div>
      <div className="status">
        <p>
          <span className="msg">{!playing && msg}</span>
          <br />
          <span className="score">SCORE: {score}</span>
          <br />
          {!playing && <button onClick={() => startGame()}>START</button>}
        </p>
      </div>
    </>
  );
}
