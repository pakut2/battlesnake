import { containsCell, isCellBlocked, isCellInBounds } from "../../../src/snake/utils";
import { createBattlesnake, createGameState } from "../../helpers/seeders";

describe("isCellInBounds", () => {
  it("should correctly return false if cell is out ouf bounds", () => {
    const snake = createBattlesnake("snake", [
      { x: 10, y: 5 },
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 9, y: 5 },
      { x: 9, y: 4 },
      { x: 9, y: 3 },
    ]);
    const gameState = createGameState(snake);

    const result = isCellInBounds(gameState, { x: 11, y: 5 });

    expect(result).toEqual(false);
  });
});

describe("isCellBlocked", () => {
  it("should correctly return false if cell is taken", () => {
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
});

describe("containsCell", () => {
  it("should correctly return false if cell is empty", () => {
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
