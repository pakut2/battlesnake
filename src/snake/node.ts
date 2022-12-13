import { Cell } from "./cell";
import { Move } from "./move";
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
    const cell = new Cell();
    const coords = this.location;
    const takenCells = cell.getTakenCells(gameState);

    if (
      !cell.isCellBlocked(gameState, { x: coords.x, y: coords.y + 1 }, takenCells) &&
      cell.isCellInBounds(gameState, { x: coords.x, y: coords.y + 1 })
    ) {
      this.neighbours.push(new Node({ x: coords.x, y: coords.y + 1 }));
    }

    if (
      !cell.isCellBlocked(gameState, { x: coords.x, y: coords.y - 1 }, takenCells) &&
      cell.isCellInBounds(gameState, { x: coords.x, y: coords.y - 1 })
    ) {
      this.neighbours.push(new Node({ x: coords.x, y: coords.y - 1 }));
    }

    if (
      !cell.isCellBlocked(gameState, { x: coords.x + 1, y: coords.y }, takenCells) &&
      cell.isCellInBounds(gameState, { x: coords.x + 1, y: coords.y })
    ) {
      this.neighbours.push(new Node({ x: coords.x + 1, y: coords.y }));
    }

    if (
      !cell.isCellBlocked(gameState, { x: coords.x - 1, y: coords.y }, takenCells) &&
      cell.isCellInBounds(gameState, { x: coords.x - 1, y: coords.y })
    ) {
      this.neighbours.push(new Node({ x: coords.x - 1, y: coords.y }));
    }
  }

  public updateNumberOfReachableCells(gameState: GameState, emptyCells: Coord[]): void {
    const move = new Move(new Cell());

    emptyCells.forEach((cell) => {
      const path = move.shortestPath({ gameState, start: this.location, target: cell });

      if (path) {
        this.reachableCells += 1;
      }
    });
  }
}
