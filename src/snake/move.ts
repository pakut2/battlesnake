import { Injectable } from "@nestjs/common";
import { isEqual } from "lodash";
import { Cell } from "./cell";
import { ShortestPathInterface } from "./interface";
import { Node } from "./node";
import { Direction, GameState, Path } from "./types/types";
import { manhattanDistance } from "./utils";

@Injectable()
export class Move {
  constructor(private readonly cell: Cell) {}

  public shortestPath({ gameState, start, target }: ShortestPathInterface): Path {
    if (isEqual(start, target)) {
      return;
    }

    const startNode = new Node(start);
    const targetNode = new Node(target);

    const unevaluatedNodes: Node[] = [];
    const evaluatedNodes: Node[] = [];

    unevaluatedNodes.push(startNode);

    while (unevaluatedNodes.length) {
      let currentNode = unevaluatedNodes.reduce((previousNode, currentNode) =>
        previousNode.totalCost < currentNode.totalCost ? previousNode : currentNode,
      );

      if (isEqual(currentNode.location, targetNode.location)) {
        const shortestPath: Node[] = [];
        shortestPath.push(currentNode);

        while (currentNode.parent) {
          shortestPath.push(currentNode.parent);
          currentNode = currentNode.parent;
        }

        const actualPath = shortestPath.reverse();

        return {
          direction: this.cell.getDirection(startNode.location, actualPath[1].location),
          shortestPath: actualPath.map((path) => path.location),
        };
      }

      unevaluatedNodes.splice(unevaluatedNodes.indexOf(currentNode), 1);
      evaluatedNodes.push(currentNode);

      currentNode.updateNeighbours(gameState);
      currentNode.neighbours.forEach((neighbour) => {
        if (
          !this.cell.containsCell(
            neighbour.location,
            evaluatedNodes.map((node) => node.location),
          )
        ) {
          const possibleCostFromStart = currentNode.costFromStart + 1;

          if (
            !this.cell.containsCell(
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
  }

  public safestPath(gameState: GameState): Direction {
    const emptyCells = this.cell.getEmptyCells(gameState);
    const snakeHead = new Node(gameState.you.head);
    snakeHead.updateNeighbours(gameState);

    snakeHead.neighbours.forEach((neighbour) => {
      neighbour.updateNumberOfReachableCells(gameState, emptyCells);
    });

    const safestNeighbour = snakeHead.neighbours.reduce((previousNode, currentNode) =>
      previousNode.reachableCells > currentNode.reachableCells ? previousNode : currentNode,
    );

    return this.cell.getDirection(snakeHead.location, safestNeighbour.location);
  }
}
