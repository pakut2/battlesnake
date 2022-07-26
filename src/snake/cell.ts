import { Injectable } from "@nestjs/common";
import { isEqual } from "lodash";
import { Borders, Coord, Direction, GameState } from "./types/types";
import { manhattanDistance } from "./utils";

@Injectable()
export class Cell {
  public getDirection(baseCell: Coord, neighbourCoords: Coord): Direction {
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
  }

  public closestTarget(baseCell: Coord, targets: Coord[]): Coord {
    const closestTarget = targets
      .map((target) => ({
        ...target,
        distance: manhattanDistance(baseCell, target),
      }))
      .reduce((coords1, coords2) => (coords1.distance < coords2.distance ? coords1 : coords2));

    return {
      x: closestTarget.x,
      y: closestTarget.y,
    };
  }

  public isCellBlocked(gameState: GameState, baseCell: Coord): boolean {
    const takenCells = this.getTakenCells(gameState);
    return this.containsCell(baseCell, takenCells);
  }

  public containsCell(baseCell: Coord, cellsToVerify: Coord[]): boolean {
    return cellsToVerify.some((cell) => isEqual(baseCell, cell));
  }

  public isCellInBounds(gameState: GameState, baseCell: Coord): boolean {
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
  }

  public getTakenCells(gameState: GameState): Coord[] {
    return gameState.board.snakes.flatMap((snake) => snake.body);
  }

  public getEmptyCells(gameState: GameState, scanRange = 3): Coord[] {
    const takenCells = this.getTakenCells(gameState);
    const { topBorder, bottomBorder, rightBorder, leftBorder } = Cell.getScannedRangeBorders(
      gameState,
      scanRange,
    );
    const emptyCells: Coord[] = [];

    for (let i = bottomBorder; i <= topBorder; i++) {
      for (let j = leftBorder; j <= rightBorder; j++) {
        const currentCell: Coord = { x: j, y: i };

        if (!takenCells.some((cell) => isEqual(cell, currentCell))) {
          emptyCells.push(currentCell);
        }
      }
    }

    return emptyCells;
  }

  private static getScannedRangeBorders(gameState: GameState, scanRange: number): Borders {
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
  }
}
