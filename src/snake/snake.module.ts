import { Module } from "@nestjs/common";
import { Move } from "./move";
import { SnakeController } from "./snake.controller";
import { SnakeService } from "./snake.service";

@Module({
  controllers: [SnakeController],
  providers: [SnakeService, Move],
})
export class SnakeModule {}
