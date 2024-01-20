import { useEffect, useState } from "react";
import "./Game.css";

// to avoid string typos
const hole = "hole";
const rabbit = "rabbit";
const carrot = "carrot";
type Target = "hole" | "rabbit" | "carrot";

export default function Game() {
  const [msg, setMsg] = useState("Attack the carrot thieves!");
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [targets, setTargets] = useState<Target[]>(new Array(9).fill(hole));

  function startGame() {
    setScore(0);
    setPlaying(true);
    setTargets(new Array(9).fill(hole));
  }

  function endGame(reason: Target) {
    setPlaying(false);
    setTargets(new Array(9).fill(hole));
    if (reason === carrot) setMsg("Carrot's gone!");
    if (reason === rabbit) setMsg("It's an innocent rabbit!");
  }

  function changeTarget(idx: number, target: Target) {
    setTargets((pre) => {
      const newTargets = [...pre];
      newTargets[idx] = target;
      return newTargets;
    });
  }

  function rabbitUp(idx: number) {
    if (targets[idx] === hole) {
      const rand = Math.floor(Math.random() * 2);
      const target = rand === 0 ? rabbit : carrot;
      changeTarget(idx, target);
    }
  }

  function rabbitDown(idx: number) {
    if (targets[idx] === carrot) {
      endGame(carrot);
    } else {
      changeTarget(idx, hole);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        const idx = Math.floor(Math.random() * targets.length);
        rabbitUp(idx);
        setTimeout(() => {
          rabbitDown(idx);
        }, 1500);
      }
    }, 200);
    return () => clearInterval(interval);
  });

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
                alt="hole"
                src={assets(target)}
                key={idx}
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
