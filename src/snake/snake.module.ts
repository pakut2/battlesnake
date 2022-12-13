import { Module } from "@nestjs/common";
import { SnakeController } from "./snake.controller";
import { SnakeService } from "./snake.service";

@Module({
  controllers: [SnakeController],
  providers: [SnakeService],
})
export class SnakeModule {}
