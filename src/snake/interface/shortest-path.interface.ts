import { Coord, GameState } from "../types/types";

export interface ShortestPathInterface {
  gameState: GameState;
  start: Coord;
  target: Coord;
}
