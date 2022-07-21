import { Injectable } from "@nestjs/common";
import { isEqual } from "lodash";
import { Food } from "./food";
import { Move } from "./move";
import { Coord, Direction, GameState, InfoResponse, ValidMoves } from "./types/types";
import { getNeighbour, shortestDistance } from "./utils";

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

  public makeMove(gameState: GameState): string {
    let chosenMove: Direction;

    const safeMoves = this.move.possibleMoves(gameState);
    const safeMovesKeys = Object.keys(safeMoves).filter(
      (key) => safeMoves[key as keyof ValidMoves],
    );

    if (Array.isArray(gameState.board.food) && gameState.board.food.length) {
      const closestFood = Food.closestFood(gameState.you.head, gameState.board.food);
      chosenMove = this.shortestFoodPath(gameState, safeMovesKeys as Direction[], closestFood);
    } else {
      chosenMove = safeMovesKeys[Math.floor(Math.random() * safeMovesKeys.length)] as Direction;
    }

    return chosenMove;
  }

  private shortestFoodPath(gameState: GameState, safeMoves: Direction[], food: Coord): Direction {
    const snakeHead = gameState.you.head;

    const safeCoords = safeMoves.map((direction) =>
      getNeighbour(snakeHead, direction as Direction),
    );

    const quickestPath = shortestDistance(food, safeCoords);

    const quickestDirection = safeCoords.find((coords) => isEqual(coords, quickestPath));

    if (quickestDirection) {
      return quickestDirection.direction;
    }

    return safeMoves[Math.floor(Math.random() * safeMoves.length)] as Direction;
  }
}
