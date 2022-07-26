import { Coord } from "../types/types";

export const manhattanDistance = (coords1: Coord, coords2: Coord): number => {
  return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);
};
