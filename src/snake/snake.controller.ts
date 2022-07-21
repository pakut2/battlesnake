import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { SnakeService } from "./snake.service";
import { GameState, InfoResponse, MoveResponse } from "./types/types";

@Controller()
export class SnakeController {
  constructor(private readonly snakeService: SnakeService) {}

  @Get()
  public info(): InfoResponse {
    return this.snakeService.info();
  }

  @Post("start")
  @HttpCode(200)
  public start(@Body() gameState: GameState): string {
    return `${gameState.game.id} START`;
  }

  @Post("move")
  @HttpCode(200)
  public move(@Body() gameState: GameState): MoveResponse {
    return { move: this.snakeService.makeMove(gameState) };
  }

  @Post("end")
  @HttpCode(200)
  public end(@Body() gameState: GameState): string {
    return `${gameState.game.id} END\n`;
  }
}
