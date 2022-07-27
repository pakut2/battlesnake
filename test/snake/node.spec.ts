import { Cell } from "../../src/snake/cell";
import { Node } from "../../src/snake/node";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Node", () => {
  describe("updateNeighbours", () => {
    it("should update nodes neighbours only with empty nodes", () => {
      const snake = createBattlesnake("snake", [
        { x: 10, y: 5 },
        { x: 10, y: 6 },
        { x: 9, y: 6 },
        { x: 9, y: 5 },
        { x: 9, y: 4 },
        { x: 9, y: 3 },
      ]);
      const gameState = createGameState(snake);

      const node = new Node({ x: 10, y: 5 });
      node.updateNeighbours(gameState);

      expect(node.neighbours).toEqual([expect.objectContaining({ location: { x: 10, y: 4 } })]);
    });

    it("should update nodes neighbours only with empty nodes - corner", () => {
      const snake = createBattlesnake("snake", [{ x: 0, y: 0 }]);
      const gameState = createGameState(snake);

      const node = new Node({ x: 0, y: 0 });
      node.updateNeighbours(gameState);

      expect(node.neighbours).toEqual([
        expect.objectContaining({ location: { x: 0, y: 1 } }),
        expect.objectContaining({ location: { x: 1, y: 0 } }),
      ]);
    });

    it("should update nodes neighbours only with empty nodes - no empty nodes", () => {
      const snake = createBattlesnake("snake", [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 0 },
      ]);
      const gameState = createGameState(snake);

      const node = new Node({ x: 2, y: 0 });
      node.updateNeighbours(gameState);

      expect(node.neighbours).toEqual([]);
    });
  });

  describe("updateNumberOfReachableCells", () => {
    it("should set the correct number of reachable cells", () => {
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
      const cell = new Cell();
      const emptyCells = cell.getEmptyCells(gameState);
      const node = new Node({ x: 3, y: 1 });

      node.updateNumberOfReachableCells(gameState, emptyCells);

      expect(node.reachableCells).toEqual(1);
    });
  });
});
