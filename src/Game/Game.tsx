import { useEffect, useRef, useState } from "react";
import "./Game.css";

// TODO: learn more TypeScript and replace those constants
type Target = "hole" | "rabbit" | "carrot";

export default function Game() {
  const [msg, setMsg] = useState("Attack the carrot thieves!");
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [targets, setTargets] = useState(new Array(9).fill("hole"));
  const locked = useRef(new Array(9).fill(false));

  const startGame = () => {
    setScore(0);
    setPlaying(true);
  };

  const endGame = (reason: Target) => {
    setPlaying(false);
    setTargets(new Array(9).fill("hole"));
    if (reason === "carrot") setMsg("Carrot's gone!");
    if (reason === "rabbit") setMsg("It's an innocent rabbit!");
  };

  const changeTarget = (idx: number, target: Target) => {
    if (playing) {
      setTargets((preTarget) => {
        const newTargets = [...preTarget];
        newTargets[idx] = target;
        return newTargets;
      });
    }
  };

  const startRabbit = (idx: number) => {
    if (targets[idx] === "hole") {
      const rand = Math.floor(Math.random() * 5);
      // rabbits : thieves = 4 : 1
      if (rand === 0) {
        changeTarget(idx, "rabbit");
      } else {
        changeTarget(idx, "carrot");
      }
    }
  };

  const endRabbit = (idx: number) => {
    if (targets[idx] === "carrot") {
      endGame("carrot");
    } else if (targets[idx] === "rabbit") {
      changeTarget(idx, "hole");
    }
  };

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        const idx = Math.floor(Math.random() * targets.length);
        if (locked.current[idx] === false) {
          locked.current[idx] = true;
          startRabbit(idx);
          setTimeout(() => {
            endRabbit(idx);
            locked.current[idx] = false;
          }, 1000);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [playing, targets]);

  const clickTarget = (idx: number) => {
    if (playing) {
      switch (targets[idx]) {
        case "hole":
          break;
        case "rabbit":
          endGame("rabbit");
          break;
        case "carrot":
          changeTarget(idx, "hole");
          setScore(score + 1);
          break;
        default:
          throw new Error("Unknown action");
      }
    }
  };

  const assets = (target: Target): string => {
    switch (target) {
      case "carrot":
        return require("./assets/carrot.png");
      case "hole":
        return require("./assets/hole.png");
      case "rabbit":
        return require("./assets/rabbit.png");
      default:
        throw new Error("Unknown action");
    }
  };

  return (
    <>
      <div className="targets">
        {targets.map((target, idx) => {
          return (
            <div key={idx} className="hole">
              <img
                alt="hole"
                src={assets(target)}
                onClick={() => clickTarget(idx)}
              />
            </div>
          );
        })}
      </div>
      <p className="status">
        <span className="msg">{!playing && msg}</span>
        <br />
        <span className="score">SCORE: {score}</span>
        <br />
        {!playing && <button onClick={() => startGame()}>START</button>}
      </p>
    </>
  );
}
