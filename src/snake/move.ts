import { isEqual } from "lodash";
import { containsCell, getDirection, getEmptyCells } from "./cell";
import { ShortestPathInterface } from "./interface";
import { Node } from "./node";
import { Direction, GameState, Path } from "./types/types";
import { manhattanDistance } from "./utils";

export const shortestPath = ({ gameState, start, target }: ShortestPathInterface): Path => {
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
        direction: getDirection(startNode.location, actualPath[1].location),
        shortestPath: actualPath.map((path) => path.location),
      };
    }

    unevaluatedNodes.splice(unevaluatedNodes.indexOf(currentNode), 1);
    evaluatedNodes.push(currentNode);

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
};

export const safestPath = (gameState: GameState): Direction => {
  const emptyCells = getEmptyCells(gameState);
  const snakeHead = new Node(gameState.you.head);
  snakeHead.updateNeighbours(gameState);

  snakeHead.neighbours.forEach((neighbour) => {
    neighbour.updateNumberOfReachableCells(gameState, emptyCells);
  });

  const safestNeighbour = snakeHead.neighbours.reduce((previousNode, currentNode) =>
    previousNode.reachableCells > currentNode.reachableCells ? previousNode : currentNode,
  );

  return getDirection(snakeHead.location, safestNeighbour.location);
};
