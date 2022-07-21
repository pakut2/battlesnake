import { GameState, ValidMoves } from "./types/types";
import { checkCollision } from "./utils";

export class Move {
  private gameState: GameState;
  private validMoves: ValidMoves;

  public possibleMoves(gameState: GameState): ValidMoves {
    this.resetState(gameState);

    this.borderCollisionValidation();
    this.bodyCollisionValidation();

    return this.validMoves;
  }

  private resetState(gameState: GameState): void {
    this.gameState = gameState;
    this.validMoves = {
      up: true,
      down: true,
      left: true,
      right: true,
    };
  }

  private borderCollisionValidation(): void {
    const snakeHead = this.gameState.you.head;
    const boardWidth = this.gameState.board.width;
    const boardHeight = this.gameState.board.height;

    if (snakeHead.x === boardWidth - 1) {
      this.validMoves.right = false;
    }

    if (snakeHead.x === 0) {
      this.validMoves.left = false;
    }

    if (snakeHead.y === boardHeight - 1) {
      this.validMoves.up = false;
    }

    if (snakeHead.y === 0) {
      this.validMoves.down = false;
    }
  }

  private bodyCollisionValidation(): void {
    const snakeHead = this.gameState.you.head;
    const snakeBody = this.gameState.you.body;
    const enemySnakeBodies = this.gameState.board.snakes.flatMap((snake) => snake.body);
    const possibleCollisions = snakeBody.concat(enemySnakeBodies);

    if (
      this.validMoves.up &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, y: snakeHead.y + 1 }),
      )
    ) {
      this.validMoves.up = false;
    }

    if (
      this.validMoves.down &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, y: snakeHead.y - 1 }),
      )
    ) {
      this.validMoves.down = false;
    }

    if (
      this.validMoves.right &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, x: snakeHead.x + 1 }),
      )
    ) {
      this.validMoves.right = false;
    }

    if (
      this.validMoves.left &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, x: snakeHead.x - 1 }),
      )
    ) {
      this.validMoves.left = false;
    }
  }
}
