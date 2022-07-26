import { manhattanDistance } from "../../../src/snake/utils";

describe("manhattanDistance", () => {
  it("should estimate distance correctly", () => {
    const result = manhattanDistance({ x: 1, y: 1 }, { x: 3, y: 5 });

    expect(result).toEqual(6);
  });
});
