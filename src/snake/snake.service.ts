import { Injectable } from "@nestjs/common";
import { closestCells } from "./cell";
import { safestPath, shortestPath } from "./move";
import { Coord, Direction, GameState, InfoResponse } from "./types/types";

@Injectable()
export class SnakeService {
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
      return safestPath(gameState);
    }
  }

  private foodExistsStrategy(gameState: GameState, availableFood: Coord[]): Direction {
    const snakeHead = gameState.you.head;
    const closestFoodLocations = closestCells(snakeHead, availableFood);

    for (const food of closestFoodLocations) {
      const path = shortestPath({ gameState, start: snakeHead, target: food });

      if (!path) {
        continue;
      }

      const { direction, shortestPath: calculatedPath } = path;
      const currentTarget = calculatedPath[calculatedPath.length - 1];
      const nextTarget = closestFoodLocations.some((nextTarget) =>
        shortestPath({ gameState, start: currentTarget, target: nextTarget }),
      );

      if (nextTarget) {
        return direction;
      }
    }

    return safestPath(gameState);
  }
}
