import { isEqual } from "lodash";
import { Coord, CoordsFromPoint, Direction } from "../types/types";

export const checkCollision = (coords1: Coord, coords2: Coord): boolean => {
  return isEqual(coords1, coords2);
};

export const getNeighbour = (baseCoords: Coord, direction: Direction): CoordsFromPoint => {
  switch (direction) {
    case "up":
      return { ...baseCoords, y: baseCoords.y + 1, direction: "up" };
    case "down":
      return { ...baseCoords, y: baseCoords.y - 1, direction: "down" };
    case "left":
      return { ...baseCoords, x: baseCoords.x - 1, direction: "left" };
    case "right":
      return { ...baseCoords, x: baseCoords.x + 1, direction: "right" };
    default:
      return { ...baseCoords, direction };
  }
};

export const shortestDistance = (baseCoords: Coord, targets: Coord[]): Coord => {
  const closestTarget = targets
    .map((target) => ({
      ...target,
      distance: manhattanDistance(baseCoords, target),
    }))
    .reduce((coords1, coords2) => (coords1.distance < coords2.distance ? coords1 : coords2));

  return {
    x: closestTarget.x,
    y: closestTarget.y,
  };
};

export const manhattanDistance = (coords1: Coord, coords2: Coord): number => {
  return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);
};
