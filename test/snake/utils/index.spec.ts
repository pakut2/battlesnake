import { manhattanDistance, superficiallyMoveSnake } from "../../../src/snake/utils";
import { createBattlesnake, createGameState } from "../../helpers/seeders";

describe("manhattanDistance", () => {
  it("should estimate distance correctly", () => {
    const result = manhattanDistance({ x: 1, y: 1 }, { x: 3, y: 5 });

    expect(result).toEqual(6);
  });
});

describe("superficiallyMoveSnake", () => {
  it("should move the snake", () => {
    const snakeBody = [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ];
    const snake = createBattlesnake("snake", snakeBody.concat());
    const gameState = createGameState(snake);
    const targetLocation = { x: 10, y: 2 };

    const result = superficiallyMoveSnake(gameState, targetLocation);

    expect(result.you.head).toEqual(targetLocation);
    expect(result.you.body[result.you.body.length - 1]).toEqual(snakeBody[snakeBody.length - 2]);
  });

  it("should move the snake", () => {
    const snakeBody = [
      { x: 8, y: 8 },
      { x: 9, y: 8 },
      { x: 10, y: 8 },
      { x: 10, y: 7 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 8, y: 6 },
      { x: 7, y: 6 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
      { x: 3, y: 6 },
      { x: 2, y: 6 },
      { x: 1, y: 6 },
      { x: 0, y: 6 },
    ];
    const snake = createBattlesnake("snake", snakeBody.concat());
    const gameState = createGameState(snake);
    const targetLocation = { x: 8, y: 7 };

    const result = superficiallyMoveSnake(gameState, targetLocation);

    expect(result.you.head).toEqual(targetLocation);
    expect(result.you.body[result.you.body.length - 1]).toEqual(snakeBody[snakeBody.length - 2]);
  });
});
