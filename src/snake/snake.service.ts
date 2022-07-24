import { Injectable } from "@nestjs/common";
import { Move } from "./move";
import { Direction, GameState, InfoResponse, ValidMoves } from "./types/types";

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
    const safeMoves = this.move.possibleMoves(gameState);
    const safeMovesKeys = Object.keys(safeMoves).filter(
      (key) => safeMoves[key as keyof ValidMoves],
    );

    if (gameState.board.food.length) {
      return this.move.pathToClosestFood(gameState).direction;
    } else {
      return safeMovesKeys[Math.floor(Math.random() * safeMovesKeys.length)] as Direction;
    }
  }
}
