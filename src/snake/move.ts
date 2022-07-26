import { Injectable } from "@nestjs/common";
import { isEqual } from "lodash";
import { Cell } from "./cell";
import { Node } from "./node";
import { Coord, Direction, GameState, PathToTarget } from "./types/types";
import { manhattanDistance, superficiallyMoveSnake } from "./utils";

@Injectable()
export class Move {
  constructor(private readonly cell: Cell) {}

  public shortestPathToTarget(gameState: GameState, start: Coord, target: Coord): PathToTarget {
    let mutableGameState: GameState = gameState;

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

        const reversedPath = shortestPath.reverse();

        return {
          direction: this.cell.getDirection(startNode.location, reversedPath[1].location),
          path: reversedPath.map((path) => path.location),
        };
      }

      unevaluatedNodes.splice(unevaluatedNodes.indexOf(currentNode), 1);
      evaluatedNodes.push(currentNode);

      if (currentNode.location !== mutableGameState.you.head) {
        mutableGameState = superficiallyMoveSnake(mutableGameState, currentNode.location);
      }

      currentNode.updateNeighbours(mutableGameState);
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

  public survivalMode(gameState: GameState): Direction {
    const emptyCells = this.cell.getEmptyCells(gameState);
    const snakeHead = new Node(gameState.you.head);
    snakeHead.updateNeighbours(gameState);

    snakeHead.neighbours.forEach((neighbour) => {
      neighbour.reachableCells = this.amountOfReachableCells(gameState, neighbour, emptyCells);
    });

    const safestNeighbour = snakeHead.neighbours.reduce((previousNode, currentNode) =>
      previousNode.reachableCells > currentNode.reachableCells ? previousNode : currentNode,
    );

    return this.cell.getDirection(snakeHead.location, safestNeighbour.location);
  }

  public amountOfReachableCells(gameState: GameState, baseNode: Node, emptyCells: Coord[]): number {
    let reachableCells = 0;

    emptyCells.forEach((cell) => {
      if (isEqual(cell, baseNode.location)) {
        return;
      }

      const path = this.shortestPathToTarget(gameState, baseNode.location, cell);

      if (path) {
        reachableCells += 1;
      }
    });

    return reachableCells;
  }
}
