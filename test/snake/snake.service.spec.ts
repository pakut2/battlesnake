import { Test, TestingModule } from "@nestjs/testing";
import { Cell } from "../../src/snake/cell";
import { Move } from "../../src/snake/move";
import { SnakeService } from "../../src/snake/snake.service";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("SnakeService", () => {
  let service: SnakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cell, Move, SnakeService],
    }).compile();

    service = module.get<SnakeService>(SnakeService);
  });

  describe("makeMove", () => {
    it("should pick the safest move if no food is present on the board", () => {
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

      const direction = service.makeMove(gameState);

      expect(direction).toEqual("left");
    });

    it("should take the safest path if it is able to reach only one piece of food", () => {
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
      const gameState = createGameState(snake, { food: [{ x: 10, y: 1 }] });

      const direction = service.makeMove(gameState);

      expect(direction).toEqual("left");
    });

    it("should take the shortest path to the closest food if it is able to reach more than 2", () => {
      const foodLocation = [
        { x: 3, y: 6 },
        { x: 10, y: 10 },
      ];
      const snake = createBattlesnake("snake", [
        { x: 0, y: 3 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ]);
      const gameState = createGameState(snake, { food: foodLocation });

      const direction = service.makeMove(gameState);

      expect(direction).toEqual("right");
    });
  });
});
