import { getTakenCells, isCellBlocked, isCellInBounds } from "./cell";
import { shortestPath } from "./move";
import { Coord, GameState } from "./types/types";

export class Node {
  public readonly location: Coord;
  public costFromStart = 0;
  public heuristic = 0;
  public totalCost = 0;
  public readonly neighbours: Node[] = [];
  public parent: Node;
  public reachableCells = 0;

  constructor(coords: Coord) {
    this.location = coords;
  }

  public updateNeighbours(gameState: GameState): void {
    const coords = this.location;
    const takenCells = getTakenCells(gameState);

    if (
      !isCellBlocked(gameState, { x: coords.x, y: coords.y + 1 }, takenCells) &&
      isCellInBounds(gameState, { x: coords.x, y: coords.y + 1 })
    ) {
      this.neighbours.push(new Node({ x: coords.x, y: coords.y + 1 }));
    }

    if (
      !isCellBlocked(gameState, { x: coords.x, y: coords.y - 1 }, takenCells) &&
      isCellInBounds(gameState, { x: coords.x, y: coords.y - 1 })
    ) {
      this.neighbours.push(new Node({ x: coords.x, y: coords.y - 1 }));
    }

    if (
      !isCellBlocked(gameState, { x: coords.x + 1, y: coords.y }, takenCells) &&
      isCellInBounds(gameState, { x: coords.x + 1, y: coords.y })
    ) {
      this.neighbours.push(new Node({ x: coords.x + 1, y: coords.y }));
    }

    if (
      !isCellBlocked(gameState, { x: coords.x - 1, y: coords.y }, takenCells) &&
      isCellInBounds(gameState, { x: coords.x - 1, y: coords.y })
    ) {
      this.neighbours.push(new Node({ x: coords.x - 1, y: coords.y }));
    }
  }

  public updateNumberOfReachableCells(gameState: GameState, emptyCells: Coord[]): void {
    emptyCells.forEach((cell) => {
      const path = shortestPath({ gameState, start: this.location, target: cell });

      if (path) {
        this.reachableCells += 1;
      }
    });
  }
}
