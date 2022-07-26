import { Test, TestingModule } from "@nestjs/testing";
import { Cell } from "../../src/snake/cell";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Cell", () => {
  let cell: Cell;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [Cell] }).compile();

    cell = module.get<Cell>(Cell);
  });

  describe("getDirection", () => {
    it("should return up when neighbour is above the head", () => {
      const result = cell.getDirection({ x: 1, y: 1 }, { x: 1, y: 2 });

      expect(result).toEqual("up");
    });

    it("should return down when neighbour is below the head", () => {
      const result = cell.getDirection({ x: 1, y: 2 }, { x: 1, y: 1 });

      expect(result).toEqual("down");
    });

    it("should return right when neighbour is to the right of the head", () => {
      const result = cell.getDirection({ x: 1, y: 1 }, { x: 2, y: 1 });

      expect(result).toEqual("right");
    });

    it("should return left when neighbour is ato the left of the head", () => {
      const result = cell.getDirection({ x: 1, y: 1 }, { x: 0, y: 1 });

      expect(result).toEqual("left");
    });
  });

  describe("closestTarget", () => {
    it("should choose the closest target", () => {
      const result = cell.closestTarget({ x: 1, y: 1 }, [
        { x: 3, y: 5 },
        { x: 4, y: 5 },
      ]);

      expect(result).toEqual({ x: 3, y: 5 });
    });

    it("should choose the last target if there are multiple the same distance away", () => {
      const result = cell.closestTarget({ x: 1, y: 1 }, [
        { x: 3, y: 5 },
        { x: 7, y: 1 },
      ]);

      expect(result).toEqual({ x: 7, y: 1 });
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

      const result = cell.isCellBlocked(gameState, { x: 10, y: 4 });

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

      const result = cell.isCellBlocked(gameState, { x: 10, y: 4 });

      expect(result).toEqual(true);
    });
  });

  describe("containsCell", () => {
    it("should return true if cell is taken", () => {
      const result = cell.containsCell({ x: 10, y: 4 }, [
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
      const result = cell.containsCell({ x: 9, y: 3 }, [
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

      const result = cell.isCellInBounds(gameState, { x: 5, y: 11 });

      expect(result).toEqual(false);
    });

    it("should return false if cell is out ouf bounds - down", () => {
      const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
      const gameState = createGameState(snake);

      const result = cell.isCellInBounds(gameState, { x: 5, y: -1 });

      expect(result).toEqual(false);
    });

    it("should return false if cell is out ouf bounds - right", () => {
      const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
      const gameState = createGameState(snake);

      const result = cell.isCellInBounds(gameState, { x: 11, y: 5 });

      expect(result).toEqual(false);
    });

    it("should return false if cell is out ouf bounds - left", () => {
      const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
      const gameState = createGameState(snake);

      const result = cell.isCellInBounds(gameState, { x: -1, y: 5 });

      expect(result).toEqual(false);
    });

    it("should return true if cell is in bounds", () => {
      const snake = createBattlesnake("snake", [{ x: 10, y: 5 }]);
      const gameState = createGameState(snake);

      const result = cell.isCellInBounds(gameState, { x: 5, y: 5 });

      expect(result).toEqual(true);
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

      const result = cell.getTakenCells(gameState);

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
    it("should return empty cells in specified radius (case 1)", () => {
      const scanRadius = 3;
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

      const result = cell.getEmptyCells(gameState);

      result.forEach((cell) => {
        snakeBody.forEach((bodyCell) => expect(cell).not.toEqual(bodyCell));
        enemySnakeBody.forEach((bodyCell) => expect(cell).not.toEqual(bodyCell));
        expect(cell.y).not.toBeGreaterThan(snakeBody[0].y + scanRadius);
        expect(cell.y).not.toBeLessThan(snakeBody[0].y - scanRadius);
        expect(cell.x).not.toBeGreaterThan(snakeBody[0].x + scanRadius);
        expect(cell.x).not.toBeLessThan(snakeBody[0].x - scanRadius);
      });
    });

    it("should return empty cells in specified radius (case 2)", () => {
      const scanRadius = 3;
      const snakeBody = [
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 4, y: 2 },
        { x: 4, y: 1 },
        { x: 4, y: 0 },
        { x: 3, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 0 },
      ];
      const snake = createBattlesnake("snake", snakeBody);
      const gameState = createGameState(snake);

      const result = cell.getEmptyCells(gameState);

      result.forEach((cell) => {
        snakeBody.forEach((bodyCell) => expect(cell).not.toEqual(bodyCell));
        expect(cell.y).not.toBeGreaterThan(snakeBody[0].y + scanRadius);
        expect(cell.y).not.toBeLessThan(snakeBody[0].y - scanRadius);
        expect(cell.x).not.toBeGreaterThan(snakeBody[0].x + scanRadius);
        expect(cell.x).not.toBeLessThan(snakeBody[0].x - scanRadius);
      });
    });
  });
});
