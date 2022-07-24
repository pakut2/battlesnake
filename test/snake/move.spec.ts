import { Move } from "../../src/snake/move";
import { createBattlesnake, createGameState } from "../helpers/seeders";

describe("Move", () => {
  describe("backwardMoveValidation", () => {
    it("should not move up into its own neck", () => {
      const validMoves = {
        up: false,
        down: true,
        left: true,
        right: true,
      };
      const snake = createBattlesnake("snake", [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move down into its own neck", () => {
      const validMoves = {
        up: true,
        down: false,
        left: true,
        right: true,
      };
      const snake = createBattlesnake("snake", [
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move left into its own neck", () => {
      const validMoves = {
        up: true,
        down: true,
        left: false,
        right: true,
      };
      const snake = createBattlesnake("snake", [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move right into its own neck", () => {
      const validMoves = {
        up: true,
        down: true,
        left: true,
        right: false,
      };
      const snake = createBattlesnake("snake", [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });
  });

  describe("borderMoveValidation", () => {
    it("should not move out of bounds - upper right corner", () => {
      const validMoves = {
        up: false,
        down: false,
        left: true,
        right: false,
      };
      const snake = createBattlesnake("snake", [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move out of bounds - lower right corner", () => {
      const validMoves = {
        up: true,
        down: false,
        left: false,
        right: false,
      };
      const snake = createBattlesnake("snake", [
        { x: 10, y: 0 },
        { x: 9, y: 0 },
        { x: 9, y: 1 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move out of bounds - up", () => {
      const validMoves = {
        up: false,
        down: false,
        left: true,
        right: true,
      };
      const snake = createBattlesnake("snake", [
        { x: 9, y: 10 },
        { x: 9, y: 9 },
        { x: 9, y: 8 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move out of bounds - down", () => {
      const validMoves = {
        up: false,
        down: false,
        left: true,
        right: true,
      };
      const snake = createBattlesnake("snake", [
        { x: 9, y: 0 },
        { x: 9, y: 1 },
        { x: 9, y: 2 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move out of bounds - left", () => {
      const validMoves = {
        up: true,
        down: true,
        left: false,
        right: false,
      };
      const snake = createBattlesnake("snake", [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });

    it("should not move out of bounds - right", () => {
      const validMoves = {
        up: true,
        down: true,
        left: false,
        right: false,
      };
      const snake = createBattlesnake("snake", [
        { x: 10, y: 1 },
        { x: 9, y: 1 },
        { x: 8, y: 1 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });
  });

  describe("bodyMoveValidation", () => {
    it("should not hit its own body", () => {
      const validMoves = {
        up: true,
        down: false,
        left: false,
        right: true,
      };
      const snake = createBattlesnake("snake", [
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
      ]);
      const gameState = createGameState(snake);
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });
  });

  describe("enemyCollisionValidation", () => {
    it("should test", () => {
      const validMoves = {
        up: true,
        down: false,
        left: true,
        right: false,
      };
      const snake = createBattlesnake("snake", [
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
      ]);
      const enemySnake = createBattlesnake("enemy", [
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 3 },
      ]);
      const gameState = createGameState(snake, { enemySnakes: [enemySnake] });
      const move = new Move();

      const moveResponse = move.possibleMoves(gameState);

      expect(validMoves).toEqual(moveResponse);
    });
  });
});
