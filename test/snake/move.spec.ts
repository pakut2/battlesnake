import { safestPath, shortestPath } from "../../src/snake/move";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Move", () => {
  describe("shortestPath", () => {
    it("should successfully determine the shortest path to the target", () => {
      const foodLocation = { x: 3, y: 6 };
      const snake = createBattlesnake("snake", [
        { x: 0, y: 3 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ]);
      const gameState = createGameState(snake, { food: [foodLocation] });

      const result = shortestPath({
        gameState,
        start: gameState.you.head,
        target: foodLocation,
      });

      const { direction, shortestPath: calculatedPath } = result;
      expect(direction).toEqual("right");
      expect(calculatedPath).toEqual([
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

      const result = shortestPath({
        gameState,
        start: gameState.you.head,
        target: foodLocation,
      });

      const { direction, shortestPath: calculatedPath } = result;
      expect(direction).toEqual("down");
      expect(calculatedPath[calculatedPath.length - 1]).toEqual(foodLocation);
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

      const result = shortestPath({
        gameState,
        start: gameState.you.head,
        target: foodLocation,
      });

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

      const result = shortestPath({
        gameState,
        start: gameState.you.head,
        target: foodLocation[0],
      });

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

      const result = shortestPath({
        gameState,
        start: gameState.you.head,
        target: foodLocation[1],
      });

      expect(result).not.toBeDefined();
    });

    it("should return undefined if start and target are in the same location", () => {
      const snake = createBattlesnake("snake", [{ x: 8, y: 8 }]);
      const gameState = createGameState(snake);

      const result = shortestPath({
        gameState,
        start: gameState.you.head,
        target: gameState.you.head,
      });

      expect(result).not.toBeDefined();
    });
  });

  describe("safestPath", () => {
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

      const result = safestPath(gameState);

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

      const result = safestPath(gameState);

      expect(result).toEqual("left");
    });
  });
});
