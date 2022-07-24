import { Food } from "./food";
import { Node } from "./node";
import { DirectionWithPath, GameState, ValidMoves } from "./types/types";
import { checkCollision, containsCell, getDirection, manhattanDistance, moveSnake } from "./utils";

export class Move {
  private gameState: GameState;
  private validMoves: ValidMoves;

  public pathToClosestFood(gameState: GameState): DirectionWithPath {
    // TODO
    //! Prevent snake from trapping itself by going for the closest food
    //! Survival mode if trapped

    const unevaluatedNodes: Node[] = [];
    const evaluatedNodes: Node[] = [];
    const shortestPath: Node[] = [];

    const startNode = new Node(gameState.you.head);
    const targetNode = new Node(Food.closestFood(gameState.you.head, gameState.board.food));

    unevaluatedNodes.push(startNode);

    while (unevaluatedNodes.length) {
      let currentNode = unevaluatedNodes.reduce((previousNode, currentNode) =>
        previousNode.totalCost < currentNode.totalCost ? previousNode : currentNode,
      );

      if (checkCollision(currentNode.location, targetNode.location)) {
        shortestPath.push(currentNode);

        while (currentNode.parent) {
          shortestPath.push(currentNode.parent);
          currentNode = currentNode.parent;
        }

        const reversedPath = shortestPath.reverse();

        return {
          direction: getDirection(startNode.location, reversedPath[1].location),
          path: reversedPath.map((path) => path.location),
        };
      }

      unevaluatedNodes.splice(unevaluatedNodes.indexOf(currentNode), 1);
      evaluatedNodes.push(currentNode);

      if (currentNode.location !== gameState.you.head) {
        gameState = moveSnake(gameState, currentNode.location);
      }

      currentNode.updateNeighbours(gameState);
      currentNode.neighbours.forEach((neighbour) => {
        if (
          !containsCell(
            neighbour.location,
            evaluatedNodes.map((node) => node.location),
          )
        ) {
          const possibleCostFromStart = currentNode.costFromStart + 1;

          if (
            !containsCell(
              neighbour.location,
              unevaluatedNodes.map((node) => node.location),
            )
          ) {
            unevaluatedNodes.push(neighbour);
          } else if (possibleCostFromStart >= neighbour.costFromStart) {
            return;
          }

          neighbour.costFromStart = possibleCostFromStart;
          neighbour.heuristic = manhattanDistance(neighbour.location, targetNode.location);
          neighbour.totalCost = neighbour.costFromStart + neighbour.heuristic;
          neighbour.parent = currentNode;
        }
      });
    }

    // no path could be found, enter survival mode
  }

  public possibleMoves(gameState: GameState): ValidMoves {
    this.resetState(gameState);

    this.borderCollisionValidation();
    this.bodyCollisionValidation();

    return this.validMoves;
  }

  private resetState(gameState: GameState): void {
    this.gameState = gameState;
    this.validMoves = {
      up: true,
      down: true,
      left: true,
      right: true,
    };
  }

  private borderCollisionValidation(): void {
    const snakeHead = this.gameState.you.head;
    const boardWidth = this.gameState.board.width;
    const boardHeight = this.gameState.board.height;

    if (snakeHead.x + 1 === boardWidth) {
      this.validMoves.right = false;
    }

    if (snakeHead.x === 0) {
      this.validMoves.left = false;
    }

    if (snakeHead.y + 1 === boardHeight) {
      this.validMoves.up = false;
    }

    if (snakeHead.y === 0) {
      this.validMoves.down = false;
    }
  }

  private bodyCollisionValidation(): void {
    const snakeHead = this.gameState.you.head;
    const snakeBody = this.gameState.you.body;
    const enemySnakeBodies = this.gameState.board.snakes.flatMap((snake) => snake.body);
    const possibleCollisions = snakeBody.concat(enemySnakeBodies);

    if (
      this.validMoves.up &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, y: snakeHead.y + 1 }),
      )
    ) {
      this.validMoves.up = false;
    }

    if (
      this.validMoves.down &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, y: snakeHead.y - 1 }),
      )
    ) {
      this.validMoves.down = false;
    }

    if (
      this.validMoves.right &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, x: snakeHead.x + 1 }),
      )
    ) {
      this.validMoves.right = false;
    }

    if (
      this.validMoves.left &&
      possibleCollisions.some((obstacle) =>
        checkCollision(obstacle, { ...snakeHead, x: snakeHead.x - 1 }),
      )
    ) {
      this.validMoves.left = false;
    }
  }
}
