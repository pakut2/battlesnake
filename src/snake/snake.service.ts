import { Injectable } from "@nestjs/common";
import { Food } from "./food";
import { Move } from "./move";
import { Direction, GameState, InfoResponse } from "./types/types";

@Injectable()
export class SnakeService {
  constructor(private readonly move: Move) {}

  public info(): InfoResponse {
    return {
      apiversion: "1",
      author: "pakut",
      color: "#543243",
      head: "default",
      tail: "default",
    } as InfoResponse;
  }

  public makeMove(gameState: GameState): Direction {
    const snakeHead = gameState.you.head;
    const availableFood = gameState.board.food;

    if (availableFood.length) {
      const closestFoodLocation = Food.closestFood(snakeHead, availableFood);
      const path = this.move.shortestPathToTarget(gameState, snakeHead, closestFoodLocation);

      if (!path) {
        return this.move.survivalMode(gameState);
      }

      return path.direction;
    } else {
      return this.move.survivalMode(gameState);
    }
  }
}
