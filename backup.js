"use strict";
class ChessPiece {
  constructor(currentVal, type, img) {
    this.currentVal = currentVal;
    this.type = type;
    this.img = img;
    this.board = new Board();
  }
  #incrementBy = {
    north: 8,
    south: -8,
    east: -1,
    west: 1,

    northEast: 7,
    northWest: 9,
    southEast: -9,
    southWest: -7,
  };
  #validateMove(nextval, distanceToEdge) {
    const board = this.board._logicBoard();
    if (nextval < board[0][0] || nextval > board.at(-1).at(-1)) return false;
    if (distanceToEdge <= 0) return false;
    return true;
  }
  #calcMove(val, increment, distanceToEdge, slideable) {
    let nextval = val - increment;
    let valid = this.#validateMove(nextval, distanceToEdge);
    if (valid) {
      if (slideable) {
        let nextvals = [];
        for (let i = 0; i <= distanceToEdge; i++) {
          let sqrval = val - increment * i;
          nextvals.push(sqrval);
        }
        return nextvals;
      }
      return [nextval];
    }
  }

  // takes the name of the direction it is to calculate, and returns the val in the direction
  // slideable(Boolean) => for sliding pieces, true if the val should be slided to the edge of the board (Q, B, R)
  // offsets => Knight pieces takes an offest number and adds it to the val for the direction to get the L movement
  // reduce => Knight pieces takes a number to reduce how far a val should be to the edge of the board to return null
  getMove(nameOfDirection, val, slideable, offset = 0, reduce = 0) {
    let distanceTo = this.board._distanceToEdges(val);
    return this.#calcMove(
      val,
      this.#incrementBy[nameOfDirection] + offset,
      distanceTo[nameOfDirection] + reduce,
      slideable
    );
  }
}
class Pawn extends ChessPiece {
  direction = this.type == "P" ? "north" : "south";
  directionTopRight =
    this.direction == "north"
      ? `${this.direction}East`
      : `${this.direction}West`;
  directionTopLeft =
    this.direction == "north"
      ? `${this.direction}West`
      : `${this.direction}East`;
  promotable =
    this.board._distanceToEdges(this.currentVal)[this.direction] <= 1;
  moves = {
    forward: this.getMove(this.direction, this.currentVal),
    topRight: this.getMove(this.directionTopRight, this.currentVal),
    topLeft: this.getMove(this.directionTopLeft, this.currentVal),
  };
}
class Rook extends ChessPiece {
  moves = {
    north: this.getMove("north", this.currentVal, true),
    south: this.getMove("south", this.currentVal, true),
    east: this.getMove("east", this.currentVal, true),
    west: this.getMove("west", this.currentVal, true),
  };
}
class Bishop extends ChessPiece {
  moves = {
    northEast: this.getMove("northEast", this.currentVal, true),
    northWest: this.getMove("northWest", this.currentVal, true),
    southEast: this.getMove("southEast", this.currentVal, true),
    southWest: this.getMove("southWest", this.currentVal, true),
  };
}
class Knight extends ChessPiece {
  moves = {
    northEastWide: this.getMove("northEast", this.currentVal, false, -1, -1),
    northWestWide: this.getMove("northWest", this.currentVal, false, +1, -1),
    southEastWide: this.getMove("southEast", this.currentVal, false, -1, -1),
    southWestWide: this.getMove("southWest", this.currentVal, false, +1, -1),

    northEastLong: this.getMove("northEast", this.currentVal, false, +8),
    northWestLong: this.getMove("northWest", this.currentVal, false, +8),
    southEastLong: this.getMove("southEast", this.currentVal, false, -8),
    southWestLong: this.getMove("southWest", this.currentVal, false, -8),
  };
}
class King extends ChessPiece {
  moves = {
    north: this.getMove("north", this.currentVal),
    south: this.getMove("south", this.currentVal),
    east: this.getMove("east", this.currentVal),
    west: this.getMove("west", this.currentVal),
    northEast: this.getMove("northEast", this.currentVal),
    northWest: this.getMove("northWest", this.currentVal),
    southEast: this.getMove("southEast", this.currentVal),
    southWest: this.getMove("southWest", this.currentVal),
  };
}
class Queen extends ChessPiece {
  moves = {
    north: this.getMove("north", this.currentVal, true),
    south: this.getMove("south", this.currentVal, true),
    east: this.getMove("east", this.currentVal, true),
    west: this.getMove("west", this.currentVal, true),
    northEast: this.getMove("northEast", this.currentVal, true),
    northWest: this.getMove("northWest", this.currentVal, true),
    southEast: this.getMove("southEast", this.currentVal, true),
    southWest: this.getMove("southWest", this.currentVal, true),
  };
}

class ChessBoard {
  constructor() {
    this.board = new Board();
    this.chessBoard = document.querySelector(".chess-board");
  }
  #numberOfRows = 8;
  #numberOfCols = 8;
  // #fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  #fenString = "r1bqkbnr/pppp2pp/2n5/4pp2/4P3/Q4N2/PPPP1PPP/RNB1KB1R";
  // #fenString = "r1bqk1nr/ppp2ppp/2n1p3/3p4/3P4/2N5/PPP1PPPP/R1BQKB1R";
  get fenString() {
    return this.#fenString;
  }
  // TODO - implement a validator to check if the fenString is valid
  // but not now, I am tired, maybe hopefully
  drawChessBoard() {
    for (let x = 0; x < this.#numberOfRows; x++) {
      let row = document.createElement("article");
      row.classList.add("chess-row");
      this.chessBoard.append(row);

      for (let y = 0; y < this.#numberOfCols; y++) {
        let sqr = document.createElement("div");
        sqr.classList.add("chess-sqr");
        row.append(sqr);

        sqr.dataset.val = this.board._logicBoard()[x][y];
        sqr.dataset.isOccupied = false;
        sqr.dataset.chessPiece = null;
        // sqr.textContent  = sqr.dataset.val;

        // WTF JS ? I need to bind "this" to function since it is passed referentially
        // if not "this" would be lost
        sqr.addEventListener("click", this.#movePiece.bind(chessBoard));
        // draw the alternating sqr colors
        if ((x + y) % 2 == 0) {
          sqr.classList.add("white-sqr");
        } else {
          sqr.classList.add("dark-sqr");
        }
        // write the numbers and alphabets on board
        if (x + y == x) {
          sqr.dataset.boardNum = 8 - x;
          sqr.classList.add("num-sqr");
        }
        if (x == this.#numberOfCols - 1) {
          sqr.dataset.boardAlph = String.fromCharCode(65 + y);
          sqr.classList.add("alph-sqr");
        }
      }
    }
    this.#placePieces();
  }
  cleanBoard() {
    this.board._logicBoard().forEach((row) => {
      row.forEach((val) => {
        let sqr = document.querySelector(`[data-val="${val}"]`);
        //  sqr.toggleEventListener("click", () =>
        //    this.#updateBoard(sqr.dataset.chessPiece, sqr.dataset.val)
        //  );
        sqr.dataset.isOccupied = false;
        sqr.dataset.chessPiece = null;
        sqr.innerHTML = "";

        // if (sqr.classList.contains("active-sqr")){
        sqr.classList.remove("active-sqr");
        //   console.log(sqr)
        // }
        // if (sqr.classList.contains("opps-sqr")){
        sqr.classList.remove("opps-sqr");
        // }
        // if (sqr.classList.contains("circle-sqr"))
        // {
        sqr.classList.remove("circle-sqr");

        // }
        // sqr.className = ""
      });
    });
  }
  #updateBoard(type, currentVal, nextval) {
    const numberOfCols = this.#numberOfCols;
    const numberOfRows = this.#numberOfRows;
    let fenToArray = function (fenString) {
      fenString = `/${fenString}`.split("");
      let fenArray = [];
      let [x, y] = [0, 0];
      fenString.forEach((symbol) => {
        if (symbol == "/") {
          fenArray.push([]);
          x++;
          y = 0;
        } else {
          if (!isNaN(symbol)) {
            for (let i = 0; i < Number(symbol); i++) {
              fenArray[x - 1].push("");
              y++;
            }
          } else {
            fenArray[x - 1].push(symbol);
            y++;
          }
        }
      });
      return fenArray;
    };
    let arrayToFen = function (fenArray) {
      let fenString = "";
      for (let x = 0; x < numberOfRows; x++) {
        let count = 0;
        for (let y = 0; y < numberOfCols; y++) {
          if (fenArray[x][y] == "") {
            count++;
          } else {
            if (count > 0) {
              fenString += count;
              count = 0;
            }
            fenString += fenArray[x][y];
          }
        }
        if (count != 0) fenString += count;
        fenString += "/";
      }
      return fenString;
    };

    let fenArray = fenToArray(this.#fenString);
    let [fromX, fromY] = this.#getCoordinates(currentVal);
    let [toX, toY] = this.#getCoordinates(nextval);
    [fenArray[fromX][fromY], fenArray[toX][toY]] = ["", type];

    let updatedFenString = arrayToFen(fenArray);
    this.#fenString = updatedFenString;
    this.cleanBoard();
    this.#placePieces();

    const display = document.querySelector(".display");
    display.textContent = `${type} ${
      this.board._corresponBoard()[fromX][fromY]
    } to ${this.board._corresponBoard()[toX][toY]}`;
  }
  #movePiece(e) {
    let sqr = e.target.closest("div");
    let piece = JSON.parse(sqr.dataset.chessPiece);
    let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);

    if (piece) {
      piece.type == "P" || piece.type == "p"
        ? console.log(piece.promote)
        : null;
      this.#highlightMoves(piece);
      let legalMoves = this.#getMoves(piece);
      for (let moves of legalMoves) {
        if (moves) {
          for (let move of moves) {
            let sqr = getSqr(move);
            sqr.addEventListener("click", () =>
              this.#updateBoard(piece.type, piece.currentVal, sqr.dataset.val)
            );
          }
        }
      }
    }
  }
  #placePieces() {
    let getColor = (symbol) =>
      symbol == symbol.toLowerCase() ? "black" : "white";

    let pieceTypeFromSymbol = (currentVal, symbol) => {
      let allTypeChessPieces = {
        r: new Rook(
          currentVal,
          symbol,
          `chessIcons/Rook,${getColor(symbol)}.svg`
        ),
        n: new Knight(
          currentVal,
          symbol,
          `chessIcons/Knight,${getColor(symbol)}.svg`
        ),
        b: new Bishop(
          currentVal,
          symbol,
          `chessIcons/Bishop,${getColor(symbol)}.svg`
        ),
        k: new King(
          currentVal,
          symbol,
          `chessIcons/King,${getColor(symbol)}.svg`
        ),
        q: new Queen(
          currentVal,
          symbol,
          `chessIcons/Queen,${getColor(symbol)}.svg`
        ),
        p: new Pawn(
          currentVal,
          symbol,
          `chessIcons/Pawn,${getColor(symbol)}.svg`
        ),
      };
      return allTypeChessPieces[symbol.toLowerCase()];
    };

    let [x, y] = [0, 0];
    this.#fenString.split("").forEach((symbol) => {
      if (symbol == "/") {
        x++;
        y = 0;
      } else {
        if (!isNaN(symbol)) y += Number(symbol);
        else {
          let currentVal = this.board._logicBoard()[x][y];
          let sqr = document.querySelector(`[data-val="${currentVal}"]`);
          let chessPiece = pieceTypeFromSymbol(currentVal, symbol);
          sqr.dataset.chessPiece = JSON.stringify(chessPiece);
          sqr.dataset.isOccupied = true;
          // add icons to the boards
          let icon = document.createElement("img");
          icon.setAttribute("src", chessPiece["img"]);
          icon.classList.add("chess-piece-icon");
          sqr.append(icon);
          y++;
        }
      }
    });
  }
  #promotePiece(currentType, nextType) {}
  #getMoves(chessPiece) {
    let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);
    let getType = (cP) =>
      cP.type == cP.type.toLowerCase() ? "black" : "white";

    // returns true if the next piece is occupied by any type -> str
    let isSqrOccupied = (val) => getSqr(val).dataset.isOccupied;
    // returns true=same type - false=opposite type
    // retruns null=empty sqr
    let isSqrOccupiedByType = (val, curP) => {
      let nextP = JSON.parse(getSqr(val).dataset.chessPiece);
      return nextP ? (getType(curP) === getType(nextP) ? true : false) : null;
    };
    if (!(typeof chessPiece === "object" && chessPiece !== null))
      throw new TypeError("not an object chess piece");

    const pawn = ["p"].includes(chessPiece.type.toLowerCase());
    const slideable = ["r", "b", "q"].includes(chessPiece.type.toLowerCase());
    if (pawn) {
      let pawnMoves = Object.entries(chessPiece.moves).map((move) => {
        let [moveName, moveVal] = [...move];
        let canAdvance =
          moveName == "forward" &&
          isSqrOccupied(moveVal, chessPiece) == "false";
        let canCaptureOpps =
          (moveName == "topRight" || moveName == "topLeft") &&
          isSqrOccupiedByType(moveVal, chessPiece) == false;

        if (canAdvance) return moveVal;
        if (canCaptureOpps) return moveVal;
      });
      return pawnMoves;
    } else if (slideable) {
      let slideableMoves = Object.entries(chessPiece.moves).map((move) => {
        let [_, moveVal] = [...move];
        let sqrOccupiedType = moveVal.map((item) =>
          isSqrOccupiedByType(item, chessPiece) ? true : false
        );
        let sqrOccupied = moveVal.map((item) =>
          isSqrOccupied(item, chessPiece) == "true" ? true : false
        );
        let positions = [],
          index = 1;
        while (
          sqrOccupiedType[index] != true &&
          index < sqrOccupiedType.length
        ) {
          positions.push(moveVal[index]);
          if (sqrOccupied[index]) break;
          index++;
        }
        return positions;
      });
      return slideableMoves;
    } else {
      let regularMoves = Object.entries(chessPiece.moves).map((move) => {
        let [_, moveVal] = [...move];
        return isSqrOccupiedByType(moveVal, chessPiece) ? null : moveVal;
      });
      return regularMoves;
    }
  }
  #highlightMoves(chessPiece) {
    let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);
    getSqr(chessPiece.currentVal).classList.toggle("active-sqr");
    let validMoves = this.#getMoves(chessPiece);
    validMoves.forEach((listOfMoves) => {
      if (listOfMoves) {
        listOfMoves.forEach((move) => {
          let nxtSqr = getSqr(move);
          let nxtSqrPiece = JSON.parse(getSqr(move).dataset.chessPiece);
          nxtSqrPiece
            ? nxtSqr.classList.toggle("opps-sqr")
            : nxtSqr.classList.toggle("circle-sqr");
        });
      }
    });
  }
  #getCoordinates(val) {
    let cor = [];
    this.board._logicBoard().forEach((row, idx) => {
      row.forEach((col, ydx) => {
        if (col == val) cor = [idx, ydx];
      });
    });
    return cor;
  }
}
class Board {
  #numberOfRows = 8;
  _logicBoard() {
    const logicBoard = [];
    let count = 0;
    for (let x = 0; x < this.#numberOfRows; x++) {
      logicBoard.push([...Array(8).keys()].map((y) => y + 8 * count));
      count++;
    }
    return logicBoard;
  }
  _corresponBoard() {
    const correspondBoard = [];
    const alph = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let x = 0; x < this.#numberOfRows; x++) {
      correspondBoard.push(
        [...Array(8).keys()].map((y) => `${alph[y]}${8 - x}`)
      );
    }
    return correspondBoard;
  }
  _distanceToEdges(val) {
    let distances = {};
    this._logicBoard().forEach((edge, x) => {
      edge.forEach((item, y) => {
        if (item == val) {
          let [north, south, east, west] = [x, 7 - x, 7 - y, y];
          // let center = Math.min(north, west, east, south)
          distances["north"] = north;
          distances["south"] = south;
          distances["east"] = east;
          distances["west"] = west;

          distances["northWest"] = Math.min(north, west);
          distances["northEast"] = Math.min(north, east);
          distances["southWest"] = Math.min(south, west);
          distances["southEast"] = Math.min(south, east);
        }
      });
    });
    return distances;
  }
}
let chessBoard = new ChessBoard();
chessBoard.drawChessBoard();
// chessBoard.fenString = "r1bqk1nr/ppp2ppp/2n1p3/3p4/3P4/2N5/PPP1PPPP/R1BQKB1R";
// chessBoard.fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
// chessBoard.cleanBoard();
// chessBoard.init();
// this.fenString = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR";
// this.fenString = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R";
// this.fenString = "r1bqk1nr/ppp2ppp/2n1p3/3p4/3P4/2N5/PPP1PPPP/R1BQKB1R";
// this.fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
