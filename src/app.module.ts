import { Module } from "@nestjs/common";
import { SnakeModule } from "./snake/snake.module";

@Module({
  imports: [SnakeModule],
})
export class AppModule {}
