import { Food } from "../../src/snake/food";

describe("Food", () => {
  describe("closestFood", () => {
    it("should correctly calculate the closest food location", () => {
      const closestFood = Food.closestFood({ x: 0, y: 2 }, [
        { x: 6, y: 8 },
        { x: 2, y: 5 },
      ]);

      expect(closestFood).toEqual({ x: 2, y: 5 });
    });
  });

  // The same distance
});
