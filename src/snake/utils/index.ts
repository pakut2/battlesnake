import { isEqual } from "lodash";
import { Coord, CoordsFromPoint, Direction, GameState } from "../types/types";

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

export const getDirection = (headCoords: Coord, neighbourCoords: Coord): Direction => {
  if (isEqual(neighbourCoords, { x: headCoords.x, y: headCoords.y + 1 })) {
    return "up";
  }

  if (isEqual(neighbourCoords, { x: headCoords.x, y: headCoords.y - 1 })) {
    return "down";
  }

  if (isEqual(neighbourCoords, { x: headCoords.x + 1, y: headCoords.y })) {
    return "right";
  }

  if (isEqual(neighbourCoords, { x: headCoords.x - 1, y: headCoords.y })) {
    return "left";
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

// export const getEmptyNeighbours = (gameState: GameState, baseNode: Node): Node[] => {
//   const emptyNeighbours: Node[] = [];
//
//   if (!isCellBlocked(gameState, { x: baseNode.location.x, y: baseNode.location.y + 1 })) {
//     emptyNeighbours.push({ location: { x: baseNode.location.x, y: baseNode.location.y + 1 } });
//   }
//
//   if (!isCellBlocked(gameState, { x: baseNode.location.x, y: baseNode.location.y - 1 })) {
//     emptyNeighbours.push({ location: { x: baseNode.location.x, y: baseNode.location.y - 1 } });
//   }
//
//   if (!isCellBlocked(gameState, { x: baseNode.location.x + 1, y: baseNode.location.y })) {
//     emptyNeighbours.push({ location: { x: baseNode.location.x + 1, y: baseNode.location.y } });
//   }
//
//   if (!isCellBlocked(gameState, { x: baseNode.location.x - 1, y: baseNode.location.y })) {
//     emptyNeighbours.push({ location: { x: baseNode.location.x - 1, y: baseNode.location.y } });
//   }
//
//   return emptyNeighbours;
// };

export const isCellBlocked = (gameState: GameState, baseCell: Coord): boolean => {
  // TODO move these into separate function
  const snakeBody = gameState.you.body;
  const enemySnakeBodies = gameState.board.snakes.flatMap((snake) => snake.body);
  const takenCells = snakeBody.concat(enemySnakeBodies);

  return containsCell(baseCell, takenCells);
};

export const containsCell = (baseCell: Coord, cellsToVerify: Coord[]): boolean => {
  return cellsToVerify.some((cell) => isEqual(baseCell, cell));
};

export const isCellInBounds = (gameState: GameState, baseCell: Coord): boolean => {
  if (baseCell.x === gameState.board.width) {
    return false;
  }

  if (baseCell.x < 0) {
    return false;
  }

  if (baseCell.y === gameState.board.height) {
    return false;
  }

  if (baseCell.y < 0) {
    return false;
  }

  return true;
};

export const moveSnake = (gameState: GameState, currentHeadLocation: Coord): GameState => {
  gameState.you.body.pop();
  gameState.you.body.unshift(gameState.you.head);
  gameState.you.head = currentHeadLocation;

  return gameState;
};
