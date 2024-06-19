import hole from "./assets/hole.png";
import rabbit from "./assets/rabbit.png";
import carrot from "./assets/carrot.png";
import "./Game.css";

export type Target = "hole" | "innocent" | "carrot";

export const assets = (target: Target): string => {
  switch (target) {
    case "carrot":
      return carrot;
    case "hole":
      return hole;
    case "innocent":
      return rabbit;
    default:
      throw new Error("Unknown action");
  }
};
