import { Test, TestingModule } from "@nestjs/testing";
import { Move } from "../../src/snake/move";
import { SnakeService } from "../../src/snake/snake.service";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("SnakeService", () => {
  let service: SnakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnakeService, Move],
    }).compile();

    service = module.get<SnakeService>(SnakeService);
  });

  describe("aStar", () => {
    it("should successfully determine the shortest path to the target", () => {
      const snake = createBattlesnake("snake", [
        { x: 0, y: 3 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ]);
      const gameState = createGameState(snake, { food: [{ x: 3, y: 6 }] });

      const result = service.aStar(gameState);

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

      const result = service.aStar(gameState);

      const { direction, path } = result;
      expect(direction).toEqual("down");
      expect(path[path.length - 1]).toEqual(foodLocation);
      expect(path).toEqual([
        { x: 10, y: 5 },
        { x: 10, y: 4 },
        { x: 10, y: 3 },
        { x: 9, y: 3 },
        { x: 9, y: 4 },
        { x: 9, y: 5 },
        { x: 9, y: 6 },
        { x: 10, y: 6 },
        { x: 10, y: 7 },
        { x: 10, y: 8 },
      ]);
    });
  });
});
