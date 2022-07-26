import { Test, TestingModule } from "@nestjs/testing";
import { Cell } from "../../src/snake/cell";
import { Move } from "../../src/snake/move";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Move", () => {
  let move: Move;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cell, Move],
    }).compile();

    move = module.get<Move>(Move);
  });

  describe("pathToClosestFood", () => {
    it("should successfully determine the shortest path to the target", () => {
      const foodLocation = { x: 3, y: 6 };
      const snake = createBattlesnake("snake", [
        { x: 0, y: 3 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ]);
      const gameState = createGameState(snake, { food: [foodLocation] });

      const result = move.shortestPathToTarget(gameState, gameState.you.head, foodLocation);

      const { direction, path } = result;
      expect(direction).toEqual("right");
      expect(path).toEqual([
        { x: 0, y: 3 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 3, y: 6 },
      ]);
    });

    it("should keep the shortest path in bounds", () => {
      const foodLocation = { x: 10, y: 8 };
      const snake = createBattlesnake("snake", [
        { x: 10, y: 5 },
        { x: 10, y: 6 },
        { x: 9, y: 6 },
        { x: 9, y: 5 },
        { x: 9, y: 4 },
        { x: 9, y: 3 },
      ]);
      const gameState = createGameState(snake, { food: [foodLocation] });

      const result = move.shortestPathToTarget(gameState, gameState.you.head, foodLocation);

      const { direction, path } = result;
      expect(direction).toEqual("down");
      expect(path[path.length - 1]).toEqual(foodLocation);
    });

    it("should return undefined in an impossible situation (case 1)", () => {
      const foodLocation = { x: 0, y: 1 };

      const snake = createBattlesnake("snake", [
        { x: 3, y: 1 },
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
      ]);
      const gameState = createGameState(snake, { food: [foodLocation] });

      const result = move.shortestPathToTarget(gameState, gameState.you.head, foodLocation);

      expect(result).not.toBeDefined();
    });

    it("should return undefined in an impossible situation (case 2)", () => {
      const foodLocation = [{ x: 8, y: 5 }];
      const snake = createBattlesnake("snake", [
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
      ]);
      const gameState = createGameState(snake, { food: [...foodLocation] });

      const result = move.shortestPathToTarget(gameState, gameState.you.head, foodLocation[0]);

      expect(result).not.toBeDefined();
    });

    it("should return undefined in an impossible situation (case 3)", () => {
      const foodLocation = [
        { x: 1, y: 9 },
        { x: 8, y: 5 },
      ];
      const snake = createBattlesnake("snake", [
        { x: 8, y: 8 },
        { x: 8, y: 9 },
        { x: 8, y: 10 },
        { x: 9, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
        { x: 10, y: 7 },
        { x: 9, y: 7 },
        { x: 8, y: 7 },
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 5, y: 7 },
        { x: 5, y: 6 },
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
        { x: 1, y: 5 },
        { x: 0, y: 5 },
        { x: 0, y: 6 },
      ]);
      const gameState = createGameState(snake, { food: [...foodLocation] });

      const result = move.shortestPathToTarget(gameState, gameState.you.head, foodLocation[1]);

      expect(result).not.toBeDefined();
    });
  });

  describe("survivalMode", () => {
    it("should return the direction of the neighbour that is able to reach the most cells (case 1)", () => {
      const snake = createBattlesnake("snake", [
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
      ]);
      const gameState = createGameState(snake);

      const result = move.survivalMode(gameState);

      expect(result).toEqual("left");
    });

    it("should return the direction of the neighbour that is able to reach the most cells (case 2)", () => {
      const snake = createBattlesnake("snake", [
        { x: 10, y: 2 },
        { x: 10, y: 3 },
        { x: 9, y: 3 },
        { x: 8, y: 3 },
        { x: 7, y: 3 },
        { x: 6, y: 3 },
        { x: 5, y: 3 },
        { x: 4, y: 3 },
        { x: 3, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 0, y: 3 },
      ]);
      const gameState = createGameState(snake);

      const result = move.survivalMode(gameState);

      expect(result).toEqual("left");
    });
  });
});
