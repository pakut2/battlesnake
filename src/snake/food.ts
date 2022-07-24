import { Coord } from "./types/types";
import { closestTarget } from "./utils";

export class Food {
  public static closestFood(snakeHead: Coord, foods: Coord[]): Coord {
    return closestTarget(snakeHead, foods);
  }
}
