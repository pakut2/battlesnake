import { isEqual } from "lodash";
import { Node } from "./node";
import { Coord, Direction, GameState, PathToTarget } from "./types/types";
import { containsCell, getDirection, getEmptyCells, manhattanDistance, moveSnake } from "./utils";

export class Move {
  public shortestPathToTarget(gameState: GameState, start: Coord, target: Coord): PathToTarget {
    // TODO
    //! Prevent snake from trapping itself by going for the closest food

    let mutableGameState: GameState = gameState;

    const startNode = new Node(start);
    const targetNode = new Node(target);

    const unevaluatedNodes: Node[] = [];
    const evaluatedNodes: Node[] = [];
    const shortestPath: Node[] = [];

    unevaluatedNodes.push(startNode);

    while (unevaluatedNodes.length) {
      let currentNode = unevaluatedNodes.reduce((previousNode, currentNode) =>
        previousNode.totalCost < currentNode.totalCost ? previousNode : currentNode,
      );

      if (isEqual(currentNode.location, targetNode.location)) {
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

      if (currentNode.location !== mutableGameState.you.head) {
        mutableGameState = moveSnake(mutableGameState, currentNode.location);
      }

      currentNode.updateNeighbours(mutableGameState);
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
  }

  public survivalMode(gameState: GameState): Direction {
    const emptyCells = getEmptyCells(gameState);
    const snakeHead = new Node(gameState.you.head);
    snakeHead.updateNeighbours(gameState);

    snakeHead.neighbours.forEach((neighbour) => {
      emptyCells.forEach((cell) => {
        if (isEqual(cell, neighbour.location)) {
          return;
        }

        const path = this.shortestPathToTarget(gameState, neighbour.location, cell);

        if (path) {
          neighbour.reachableCells += 1;
        }
      });
    });

    const safestNeighbour = snakeHead.neighbours.reduce((previousNode, currentNode) =>
      previousNode.reachableCells > currentNode.reachableCells ? previousNode : currentNode,
    );

    return getDirection(snakeHead.location, safestNeighbour.location);
  }
}
