import type { Coord, GameState } from "../types";

export interface ShortestPathInterface {
  gameState: GameState;
  start: Coord;
  target: Coord;
}
