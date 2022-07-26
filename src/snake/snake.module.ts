import { Module } from "@nestjs/common";
import { Cell } from "./cell";
import { Move } from "./move";
import { SnakeController } from "./snake.controller";
import { SnakeService } from "./snake.service";

@Module({
  controllers: [SnakeController],
  providers: [Cell, Move, SnakeService],
})
export class SnakeModule {}
