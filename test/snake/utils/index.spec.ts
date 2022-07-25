import {
  closestTarget,
  containsCell,
  getDirection,
  getEmptyCells,
  getTakenCells,
  isCellBlocked,
  isCellInBounds,
  manhattanDistance,
  moveSnake,
} from "../../../src/snake/utils";
import { createBattlesnake, createGameState } from "../../helpers/seeders";
import { isEqual } from "lodash";

describe("getDirection", () => {
  it("should return up when neighbour is above the head", () => {
    const result = getDirection({ x: 1, y: 1 }, { x: 1, y: 2 });

    expect(result).toEqual("up");
  });

  it("should return down when neighbour is below the head", () => {
    const result = getDirection({ x: 1, y: 2 }, { x: 1, y: 1 });

    expect(result).toEqual("down");
  });

  it("should return right when neighbour is to the right of the head", () => {
    const result = getDirection({ x: 1, y: 1 }, { x: 2, y: 1 });

    expect(result).toEqual("right");
  });

  it("should return left when neighbour is ato the left of the head", () => {
    const result = getDirection({ x: 1, y: 1 }, { x: 0, y: 1 });

    expect(result).toEqual("left");
  });
});

describe("closestTarget", () => {
  it("should choose the closest target", () => {
    const result = closestTarget({ x: 1, y: 1 }, [
      { x: 3, y: 5 },
      { x: 4, y: 5 },
    ]);

    expect(result).toEqual({ x: 3, y: 5 });
  });

  it("should choose the last target if there are multiple the same distance away", () => {
    const result = closestTarget({ x: 1, y: 1 }, [
      { x: 3, y: 5 },
      { x: 7, y: 1 },
    ]);

    expect(result).toEqual({ x: 7, y: 1 });
  });
});

describe("manhattanDistance", () => {
  it("should estimate distance correctly", () => {
    const result = manhattanDistance({ x: 1, y: 1 }, { x: 3, y: 5 });

    expect(result).toEqual(6);
  });
});

describe("isCellBlocked", () => {
  it("should return false if cell is taken by player snake", () => {
    const snake = createBattlesnake("snake", [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ]);
    const gameState = createGameState(snake);

    const result = isCellBlocked(gameState, { x: 10, y: 4 });

    expect(result).toEqual(true);
  });

  it("should return false if cell is taken by enemy snake", () => {
    const snake = createBattlesnake("snake", [
      { x: 1, y: 5 },
      { x: 1, y: 4 },
    ]);
    const enemySnake = createBattlesnake("enemy", [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ]);
    const gameState = createGameState(snake, { enemySnakes: [enemySnake] });

    const result = isCellBlocked(gameState, { x: 10, y: 4 });

    expect(result).toEqual(true);
  });
});

describe("containsCell", () => {
  it("should return true if cell is taken", () => {
    const result = containsCell({ x: 10, y: 4 }, [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ]);

    expect(result).toEqual(true);
  });

  it("should return false if cell is empty", () => {
    const result = containsCell({ x: 9, y: 3 }, [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ]);

    expect(result).toEqual(false);
  });
});

describe("isCellInBounds", () => {
  it("should return false if cell is out ouf bounds - up", () => {
    const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
    const gameState = createGameState(snake);

    const result = isCellInBounds(gameState, { x: 5, y: 11 });

    expect(result).toEqual(false);
  });

  it("should return false if cell is out ouf bounds - down", () => {
    const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
    const gameState = createGameState(snake);

    const result = isCellInBounds(gameState, { x: 5, y: -1 });

    expect(result).toEqual(false);
  });

  it("should return false if cell is out ouf bounds - right", () => {
    const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
    const gameState = createGameState(snake);

    const result = isCellInBounds(gameState, { x: 11, y: 5 });

    expect(result).toEqual(false);
  });

  it("should return false if cell is out ouf bounds - left", () => {
    const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
    const gameState = createGameState(snake);

    const result = isCellInBounds(gameState, { x: -1, y: 5 });

    expect(result).toEqual(false);
  });

  it("should return true if cell is in bounds", () => {
    const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
    const gameState = createGameState(snake);

    const result = isCellInBounds(gameState, { x: 5, y: 5 });

    expect(result).toEqual(true);
  });
});

describe("moveSnake", () => {
  it("should move the snake", () => {
    const snakeBody = [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
    ];
    const snake = createBattlesnake("snake", snakeBody);
    const gameState = createGameState(snake);
    const headLocation = { x: 10, y: 2 };

    const result = moveSnake(gameState, headLocation);

    expect(result.you.head).toEqual(headLocation);
    expect(result.you.body[0]).toEqual(snakeBody[0]);
    expect(result.you.body[result.you.body.length - 1]).toEqual(snakeBody[snakeBody.length - 1]);
  });
});

describe("getTakenCells", () => {
  it("should return cells taken by snakes", () => {
    const snake = createBattlesnake("snake", [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
    ]);
    const enemy = createBattlesnake("enemy", [
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 9, y: 5 },
    ]);
    const gameState = createGameState(snake, { enemySnakes: [enemy] });

    const result = getTakenCells(gameState);

    expect(result).toEqual([
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 9, y: 5 },
    ]);
  });
});

describe("getEmptyCells", () => {
  it("should return empty cells", () => {
    const snakeBody = [
      { x: 10, y: 3 },
      { x: 10, y: 4 },
      { x: 10, y: 5 },
    ];
    const enemySnakeBody = [
      { x: 9, y: 3 },
      { x: 9, y: 4 },
      { x: 9, y: 5 },
    ];
    const snake = createBattlesnake("snake", snakeBody);
    const enemy = createBattlesnake("enemy", enemySnakeBody);
    const gameState = createGameState(snake, { enemySnakes: [enemy] });

    const result = getEmptyCells(gameState);

    result.forEach((cell) => {
      snakeBody.forEach((bodyCell) => expect(cell).not.toEqual(bodyCell));
      enemySnakeBody.forEach((bodyCell) => expect(cell).not.toEqual(bodyCell));
    });
  });
});
