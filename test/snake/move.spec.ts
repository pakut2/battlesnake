import { Move } from "../../src/snake/move";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Move", () => {
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
      const move = new Move();

      const result = move.shortestPathToTarget(gameState, { x: 0, y: 3 }, foodLocation);

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
      const move = new Move();

      const result = move.shortestPathToTarget(gameState, { x: 10, y: 5 }, foodLocation);

      const { direction, path } = result;
      expect(direction).toEqual("down");
      expect(path[path.length - 1]).toEqual(foodLocation);
      // expect(path).toEqual([
      //   { x: 10, y: 5 },
      //   { x: 10, y: 4 },
      //   { x: 10, y: 3 },
      //   { x: 9, y: 3 },
      //   { x: 9, y: 4 },
      //   { x: 9, y: 5 },
      //   { x: 9, y: 6 },
      //   { x: 10, y: 6 },
      //   { x: 10, y: 7 },
      //   { x: 10, y: 8 },
      // ]);
    });

    // it("should return undefined in impossible situation", () => {
    //   const foodLocation = [
    //     { x: 1, y: 9 },
    //     { x: 8, y: 5 },
    //   ];
    //   const snake = createBattlesnake("snake", [
    //     { x: 8, y: 8 },
    //     { x: 8, y: 9 },
    //     { x: 8, y: 10 },
    //     { x: 9, y: 10 },
    //     { x: 10, y: 10 },
    //     { x: 10, y: 9 },
    //     { x: 10, y: 8 },
    //     { x: 10, y: 7 },
    //     { x: 9, y: 7 },
    //     { x: 8, y: 7 },
    //     { x: 7, y: 7 },
    //     { x: 6, y: 7 },
    //     { x: 5, y: 7 },
    //     { x: 5, y: 6 },
    //     { x: 5, y: 5 },
    //     { x: 5, y: 4 },
    //     { x: 4, y: 4 },
    //     { x: 3, y: 4 },
    //     { x: 3, y: 5 },
    //     { x: 2, y: 5 },
    //     { x: 1, y: 5 },
    //     { x: 0, y: 5 },
    //     { x: 0, y: 6 },
    //   ]);
    //   const gameState = createGameState(snake, { food: [...foodLocation] });
    //   const move = new Move();
    //
    //   const result = move.shortestPathToTarget(gameState, { x: 8, y: 5 });
    //
    //   console.log(result);
    // });
  });

  describe("survivalMode", () => {
    it("should return the direction of the neighbour that is able to reach the most cells", () => {
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
      const move = new Move();

      const result = move.survivalMode(gameState);

      expect(result).toEqual("left");
    });
  });
});
