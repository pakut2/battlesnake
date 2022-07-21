import { Coord } from "./types/types";
import { shortestDistance } from "./utils";

export class Food {
  public static closestFood(snakeHead: Coord, foods: Coord[]): Coord {
    return shortestDistance(snakeHead, foods);
  }
}
