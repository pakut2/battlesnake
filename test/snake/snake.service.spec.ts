import { Test, TestingModule } from "@nestjs/testing";
import { Cell } from "../../src/snake/cell";
import { Move } from "../../src/snake/move";
import { SnakeService } from "../../src/snake/snake.service";

describe("SnakeService", () => {
  let service: SnakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cell, Move, SnakeService],
    }).compile();

    service = module.get<SnakeService>(SnakeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
