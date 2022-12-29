import type { Battlesnake, Coord, GameState } from "../../src/snake/types";

interface GameStateExtensions {
  enemySnakes: Battlesnake[];
  food: Coord[];
  hazards: Coord[];
}

export const createGameState = (
  snake: Battlesnake,
  extensions?: Partial<GameStateExtensions>,
): GameState => {
  return {
    game: {
      id: "",
      ruleset: {
        name: "",
        version: "",
        settings: {
          foodSpawnChance: 25,
          minimumFood: 1,
          hazardDamagePerTurn: 14,
          hazardMap: "",
          hazardMapAuthor: "",
          royale: {
            shrinkEveryNTurns: 5,
          },
          squad: {
            allowBodyCollisions: true,
            sharedElimination: true,
            sharedHealth: true,
            sharedLength: true,
          },
        },
      },
      timeout: 0,
      source: "league",
    },
    turn: 0,
    board: {
      height: 11,
      width: 11,
      food: [...(extensions && extensions.food ? extensions.food : [])],
      snakes: [snake, ...(extensions && extensions.enemySnakes ? extensions.enemySnakes : [])],
      hazards: [...(extensions && extensions.hazards ? extensions.hazards : [])],
    },
    you: snake,
  };
};

export const createBattlesnake = (id: string, body: Coord[]): Battlesnake => {
  return {
    id: id,
    name: id,
    health: 0,
    body: body,
    latency: "",
    head: body[0],
    length: body.length,
    shout: "",
    squad: "",
    customizations: {
      color: "#543243",
      head: "default",
      tail: "default",
    },
  };
};
