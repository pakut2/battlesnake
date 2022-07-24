import { Node } from "../../src/snake/node";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Node", () => {
  describe("updateNeighbours", () => {
    it("should update nodes neighbours with not occupied nodes", () => {
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
  });
});
