import { Test, TestingModule } from "@nestjs/testing";
import { Move } from "../../src/snake/move";
import { SnakeService } from "../../src/snake/snake.service";

describe("SnakeService", () => {
  let service: SnakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnakeService, Move],
    }).compile();

    service = module.get<SnakeService>(SnakeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
