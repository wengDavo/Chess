import { HelperBoard } from "./HelperBoard";

class ChessPiece {
  helperBoard = new HelperBoard();
  constructor(currentVal, type, img) {
    this.img = img;
    this.type = type;
    this.currentVal = currentVal;
  }
  #incrementBy = {
    N: 8,
    S: -8,
    E: -1,
    W: 1,
    NE: 7,
    NW: 9,
    SE: -9,
    SW: -7,
    // KNIGHTS NORTH EAST WIDE, NORTH EAST LONG

    NEW: 6,
    NWW: 10,
    SEW: -10,
    SWW: -6,
    NEL: 15,
    NWL: 17,
    SEL: -17,
    SWL: -15,
  };

  getMove(direction, val, slideable = false, offset = 0) {
    const board = this.helperBoard._logicBoard();
    let nextval = val - this.#incrementBy[direction];
    let distanceToEdge = this.helperBoard._distanceToEdges(val)[direction];

    if (nextval < board[0][0] || nextval > board.at(-1).at(-1)) return null;
    if (distanceToEdge <= 0) return null;
    if (slideable) {
      let nextvals = [];
      for (let i = 0; i <= distanceToEdge; i++) {
        let sqrval = val - this.#incrementBy[direction] * i;
        nextvals.push(sqrval);
      }
      return nextvals;
    }
    return nextval;
  }
}

export class Pawn extends ChessPiece {
  #direction = this.type == "p" ? "S" : "N";
  promotable =
    this.helperBoard._distanceToEdges(this.currentVal)[this.direction] <= 1;

  #movesDirections = [
    `${this.#direction}`,
    `${this.#direction}E`,
    `${this.#direction}W`,
  ];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal)
  );
}

export class Rook extends ChessPiece {
  #movesDirections = ["N", "S", "E", "W"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal, true)
  );
}

export class Bishop extends ChessPiece {
  #movesDirections = ["NE", "NW", "SE", "SW"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal, true)
  );
}
export class Knight extends ChessPiece {
  #movesDirections = ["NEW", "NWW", "SEW", "SWW", "NEL", "NWL", "SEL", "SWL"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal)
  );
}

export class King extends ChessPiece {
  #movesDirections = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal)
  );
}

export class Queen extends ChessPiece {
  #movesDirections = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal, true)
  );
}
