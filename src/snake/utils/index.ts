import { Coord, GameState } from "../types/types";

export const manhattanDistance = (coords1: Coord, coords2: Coord): number => {
  return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);
};

export const superficiallyMoveSnake = (
  gameState: GameState,
  currentHeadLocation: Coord,
): GameState => {
  gameState.you.body.pop();
  gameState.you.body.unshift(currentHeadLocation);
  gameState.you.head = gameState.you.body[0];

  return gameState;
};
