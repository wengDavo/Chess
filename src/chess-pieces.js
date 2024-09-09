import { ChessUtils } from "./chess-utils";

class ChessPiece {
    helperBoard = new ChessUtils();
    constructor(currentVal, type, img) {
        this.img = img;
        this.type = type;
        this.currentVal = currentVal;
    }
}

export class Pawn extends ChessPiece {
    get moves() {
        const moves = [];
        const [x, y] = this.helperBoard._getCoordinates(this.currentVal);
        const isWhite = this.type === 'P';
        const direction = isWhite ? -1 : 1;

        // Note: The pawn's move generation is unique.
        // We create separate "rays" for pushes vs. captures
        // so the validation logic can treat them differently.

        // Push moves (single and double) go into the first ray
        const singlePushX = x + direction;
        if (singlePushX >= 0 && singlePushX < 8) {
            const pushRay = [this.helperBoard._logicBoard()[singlePushX][y]];
            const startRank = isWhite ? 6 : 1;
            if (x === startRank) {
                const doublePushX = x + (2 * direction);
                if (doublePushX >= 0 && doublePushX < 8) {
                    pushRay.push(this.helperBoard._logicBoard()[doublePushX][y]);
                }
            }
            moves.push(pushRay);
        }

        // Capture moves each get their own ray
        const captureY = [y - 1, y + 1];
        for (const newY of captureY) {
            if (singlePushX >= 0 && singlePushX < 8 && newY >= 0 && newY < 8) {
                moves.push([this.helperBoard._logicBoard()[singlePushX][newY]]);
            }
        }
        return moves;
    }
}


export class Knight extends ChessPiece {
    get moves() {
        const moves = [];
        const [x, y] = this.helperBoard._getCoordinates(this.currentVal);
        const moveOffsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2],  [1, 2],  [2, -1],  [2, 1],
        ];

        for (const [dx, dy] of moveOffsets) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                moves.push(this.helperBoard._logicBoard()[newX][newY]);
            }
        }
        // Return all moves as a single "ray" because knights are not blocked
        return [moves];
    }
}

export class King extends ChessPiece {
    get moves() {
        const moves = [];
        const [x, y] = this.helperBoard._getCoordinates(this.currentVal);
        const moveOffsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1],
        ];

        for (const [dx, dy] of moveOffsets) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                moves.push(this.helperBoard._logicBoard()[newX][newY]);
            }
        }
        // Return all moves as a single "ray"
        return [moves];
    }
}


class SlidingPiece extends ChessPiece {
    getSlidingMoves(directions) {
        const moves = [];
        const [startX, startY] = this.helperBoard._getCoordinates(this.currentVal);

        for (const [dx, dy] of directions) {
            const currentRay = [];
            let newX = startX + dx;
            let newY = startY + dy;

            while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                currentRay.push(this.helperBoard._logicBoard()[newX][newY]);
                newX += dx;
                newY += dy;
            }

            if (currentRay.length > 0) {
                moves.push(currentRay);
            }
        }
        return moves;
    }
}

export class Rook extends SlidingPiece {
    get moves() {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // N, S, W, E
        ];
        return this.getSlidingMoves(directions);
    }
}

export class Bishop extends SlidingPiece {
    get moves() {
        const directions = [
            [-1, -1], [1, 1], [1, -1], [-1, 1] // NW, SE, SW, NE
        ];
        return this.getSlidingMoves(directions);
    }
}

export class Queen extends SlidingPiece {
    get moves() {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [1, 1], [1, -1], [-1, 1],
        ];
        return this.getSlidingMoves(directions);
    }
}
