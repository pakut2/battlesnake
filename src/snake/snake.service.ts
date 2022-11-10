import { Injectable } from "@nestjs/common";
import { Cell } from "./cell";
import { Move } from "./move";
import { Coord, Direction, GameState, InfoResponse } from "./types/types";

@Injectable()
export class SnakeService {
  constructor(private readonly cell: Cell, private readonly move: Move) {}

  public info(): InfoResponse {
    return {
      apiversion: "1",
      author: "pakut",
      color: "#d9d9d9",
      head: "shades",
      tail: "curled",
    };
  }

  public makeMove(gameState: GameState): Direction {
    const availableFood = gameState.board.food;

    if (availableFood.length) {
      return this.foodExistsStrategy(gameState, availableFood);
    } else {
      return this.move.safestPath(gameState);
    }
  }

  private foodExistsStrategy(gameState: GameState, availableFood: Coord[]): Direction {
    const snakeHead = gameState.you.head;
    const closestFoodLocations = this.cell.closestCells(snakeHead, availableFood);

    for (const food of closestFoodLocations) {
      const path = this.move.shortestPath(gameState, snakeHead, food);

      if (!path) {
        continue;
      }

      const { direction, shortestPath } = path;
      const currentTarget = shortestPath[shortestPath.length - 1];
      const nextTarget = closestFoodLocations.some((nextTarget) =>
        this.move.shortestPath(gameState, currentTarget, nextTarget),
      );

      if (nextTarget) {
        return direction;
      }
    }

    return this.move.safestPath(gameState);
  }
}
