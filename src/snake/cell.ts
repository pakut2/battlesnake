import { isEqual } from "lodash";
import type { Borders, Coord, Direction, GameState } from "./types";

export const getDirection = (baseCell: Coord, neighbourCoords: Coord): Direction => {
  if (isEqual(neighbourCoords, { x: baseCell.x, y: baseCell.y + 1 })) {
    return "up";
  }

  if (isEqual(neighbourCoords, { x: baseCell.x, y: baseCell.y - 1 })) {
    return "down";
  }

  if (isEqual(neighbourCoords, { x: baseCell.x + 1, y: baseCell.y })) {
    return "right";
  }

  if (isEqual(neighbourCoords, { x: baseCell.x - 1, y: baseCell.y })) {
    return "left";
  }
};

export const closestCells = (baseCell: Coord, targetCells: Coord[]): Coord[] => {
  return targetCells
    .map((target) => ({
      ...target,
      distance: manhattanDistance(baseCell, target),
    }))
    .sort((target1, target2) => target1.distance - target2.distance)
    .map((target) => ({ x: target.x, y: target.y }));
};

export const isCellBlocked = (
  gameState: GameState,
  baseCell: Coord,
  takenCells: Coord[],
): boolean => containsCell(baseCell, takenCells);

export const containsCell = (baseCell: Coord, cellsToVerify: Coord[]): boolean =>
  cellsToVerify.some((cell) => isEqual(baseCell, cell));

export const isCellInBounds = (gameState: GameState, baseCell: Coord): boolean => {
  const boardLowerBorder = 0;

  if (baseCell.x === gameState.board.width) {
    return false;
  }

  if (baseCell.x < boardLowerBorder) {
    return false;
  }

  if (baseCell.y === gameState.board.height) {
    return false;
  }

  if (baseCell.y < boardLowerBorder) {
    return false;
  }

  return true;
};

export const getTakenCells = (gameState: GameState): Coord[] =>
  gameState.board.snakes.flatMap((snake) => snake.body).concat(gameState.board.hazards);

export const getEmptyCells = (gameState: GameState, scanRange = 3): Coord[] => {
  if (gameState.you.length > 30) {
    scanRange = 4;
  }

  const takenCells = getTakenCells(gameState);
  const { topBorder, bottomBorder, rightBorder, leftBorder } = getScannedRangeBorders(
    gameState,
    scanRange,
  );
  const emptyCells: Coord[] = [];

  for (let y = bottomBorder; y <= topBorder; y++) {
    for (let x = leftBorder; x <= rightBorder; x++) {
      const currentCell: Coord = { x, y };

      if (!takenCells.some((cell) => isEqual(cell, currentCell))) {
        emptyCells.push(currentCell);
      }
    }
  }

  return emptyCells;
};

const getScannedRangeBorders = (gameState: GameState, scanRange: number): Borders => {
  const boardLowerBorder = 0;
  let topBorder = gameState.you.head.y + scanRange;
  let bottomBorder = gameState.you.head.y - scanRange;
  let rightBorder = gameState.you.head.x + scanRange;
  let leftBorder = gameState.you.head.x - scanRange;

  if (topBorder >= gameState.board.height - 1) {
    topBorder = gameState.board.height - 1;
  }

  if (bottomBorder <= boardLowerBorder) {
    bottomBorder = boardLowerBorder;
  }

  if (rightBorder >= gameState.board.width - 1) {
    rightBorder = gameState.board.width - 1;
  }

  if (leftBorder <= boardLowerBorder) {
    leftBorder = boardLowerBorder;
  }

  return { topBorder, bottomBorder, rightBorder, leftBorder };
};

export const manhattanDistance = (coords1: Coord, coords2: Coord): number => {
  return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);
};
