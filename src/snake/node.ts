import { Cell } from "./cell";
import { Coord, GameState } from "./types/types";

export class Node {
  public readonly location: Coord;
  public costFromStart: number;
  public heuristic: number;
  public totalCost: number;
  public readonly neighbours: Node[];
  public parent: Node;
  public reachableCells: number;

  constructor(coords: Coord) {
    this.location = coords;
    this.costFromStart = 0;
    this.heuristic = 0;
    this.totalCost = 0;
    this.neighbours = [];
    this.parent = undefined;
    this.reachableCells = 0;
  }

  public updateNeighbours(gameState: GameState): void {
    const cell = new Cell();
    const coords = this.location;

    if (
      !cell.isCellBlocked(gameState, { x: coords.x, y: coords.y + 1 }) &&
      cell.isCellInBounds(gameState, { x: coords.x, y: coords.y + 1 })
    ) {
      this.neighbours.push(new Node({ x: coords.x, y: coords.y + 1 }));
    }

    if (
      !cell.isCellBlocked(gameState, { x: coords.x, y: coords.y - 1 }) &&
      cell.isCellInBounds(gameState, { x: coords.x, y: coords.y - 1 })
    ) {
      this.neighbours.push(new Node({ x: coords.x, y: coords.y - 1 }));
    }

    if (
      !cell.isCellBlocked(gameState, { x: coords.x + 1, y: coords.y }) &&
      cell.isCellInBounds(gameState, { x: coords.x + 1, y: coords.y })
    ) {
      this.neighbours.push(new Node({ x: coords.x + 1, y: coords.y }));
    }

    if (
      !cell.isCellBlocked(gameState, { x: coords.x - 1, y: coords.y }) &&
      cell.isCellInBounds(gameState, { x: coords.x - 1, y: coords.y })
    ) {
      this.neighbours.push(new Node({ x: coords.x - 1, y: coords.y }));
    }
  }
}
