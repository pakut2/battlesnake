import { Injectable } from "@nestjs/common";
import { Food } from "./food";
import { Move } from "./move";
import { Node } from "./node";
import { Direction, DirectionWithPath, GameState, InfoResponse, ValidMoves } from "./types/types";
import { checkCollision, containsCell, getDirection, manhattanDistance, moveSnake } from "./utils";

@Injectable()
export class SnakeService {
  constructor(private readonly move: Move) {}

  public info(): InfoResponse {
    return {
      apiversion: "1",
      author: "pakut",
      color: "#543243",
      head: "default",
      tail: "default",
    } as InfoResponse;
  }

  public makeMove(gameState: GameState): Direction {
    // TODO
    // Prevent snake from trapping itself by going for the closest food
    // Survival mode if trapped

    const safeMoves = this.move.possibleMoves(gameState);
    const safeMovesKeys = Object.keys(safeMoves).filter(
      (key) => safeMoves[key as keyof ValidMoves],
    );

    if (gameState.board.food.length) {
      return this.aStar(gameState).direction;
    } else {
      return safeMovesKeys[Math.floor(Math.random() * safeMovesKeys.length)] as Direction;
    }
  }

  public aStar(gameState: GameState): DirectionWithPath {
    const evaluatedNodes: Node[] = [];
    const unevaluatedNodes: Node[] = [];
    const shortestPath: Node[] = [];

    const startNode = new Node(gameState.you.head);
    const targetNode = new Node(Food.closestFood(gameState.you.head, gameState.board.food));

    evaluatedNodes.push(startNode);

    while (evaluatedNodes.length) {
      let currentNode = evaluatedNodes.reduce((previousNode, currentNode) =>
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

      evaluatedNodes.splice(evaluatedNodes.indexOf(currentNode), 1);
      unevaluatedNodes.push(currentNode);

      if (currentNode.location !== gameState.you.head) {
        gameState = moveSnake(gameState, currentNode.location);
      }

      currentNode.updateNeighbours(gameState);
      currentNode.neighbours.forEach((neighbour) => {
        if (
          !containsCell(
            neighbour.location,
            unevaluatedNodes.map((node) => node.location),
          )
        ) {
          const possibleCostFromStart = currentNode.costFromStart + 1;

          if (
            !containsCell(
              neighbour.location,
              evaluatedNodes.map((node) => node.location),
            )
          ) {
            evaluatedNodes.push(neighbour);
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

    // return no path could be found
  }
}
