"use strict";
// TODO
// feature => checkmate and castling
class ChessPiece {
  constructor(currentVal, type, img) {
    this.img = img;
    this.type = type;
    this.board = new Board();
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
    // NWW => 10
    NWW: 9,
    // SEW => -10
    SEW: -9,
    // SWW => -6
    SWW: -5,
    NEL: 15,
    NWL: 17,
    SEL: -17,
    SWL: -15,
    // NEW: 6,
    // NWW: 10,
    // SEW: -10,
    // SWW: -6,
    // NEL: 15,
    // NWL: 17,
    // SEL: -17,
    // SWL: -15,
  };

  getMove(direction, val, slideable = false, offset = 0) {
    const board = this.board._logicBoard();
    const getSqr = (val) => document.querySelector(`[data-val="${val}"]`);
    let nextval = val - this.#incrementBy[direction];
    let distanceToEdge = this.board._distanceToEdges(val)[direction];

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
class Pawn extends ChessPiece {
  constructor(currentVal, type, img) {
    super(currentVal, type, img);
  }
  #direction = this.type == "p" ? "S" : "N";
  promotable =
    this.board._distanceToEdges(this.currentVal)[this.direction] <= 1;
  hasMoved = false;
  #movesDirections = [
    `${this.#direction}`,
    `${this.#direction}E`,
    `${this.#direction}W`,
  ];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal)
  );
}

class Rook extends ChessPiece {
  constructor(currentVal, type, img) {
    super(currentVal, type, img);
  }
  #movesDirections = ["N", "S", "E", "W"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal, true)
  );
}
class Bishop extends ChessPiece {
  constructor(currentVal, type, img) {
    super(currentVal, type, img);
  }
  #movesDirections = ["NE", "NW", "SE", "SW"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal, true)
  );
}
class Knight extends ChessPiece {
  constructor(currentVal, type, img) {
    super(currentVal, type, img);
  }

  #movesDirections = ["NEW", "NWW", "SEW", "SWW", "NEL", "NWL", "SEL", "SWL"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal)
  );
}
class King extends ChessPiece {
  constructor(currentVal, type, img) {
    super(currentVal, type, img);
  }
  #movesDirections = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal)
  );
}
class Queen extends ChessPiece {
  constructor(currentVal, type, img) {
    super(currentVal, type, img);
  }
  #movesDirections = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
  moves = this.#movesDirections.map((direction) =>
    this.getMove(direction, this.currentVal, true)
  );
}

class ChessBoard {
  constructor() {
    this.board = new Board();
    this.chessBoard = document.querySelector(".chess-board");
    this.displayPanel = document.querySelector(".display");
    this.moves = [];
  }
  #numberOfRows = 8;
  #numberOfCols = 8;
  #whoPlayedLast = "";
  #fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
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

        sqr.addEventListener("click", this.#movePiece.bind(chessBoard));
        sqr.addEventListener("dragover", (e) => e.preventDefault());

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
  #cleanChessBoard() {
    this.board._logicBoard().forEach((row) => {
      row.forEach((val) => {
        let sqr = document.querySelector(`[data-val="${val}"]`);
        sqr.dataset.isOccupied = false;
        sqr.dataset.chessPiece = null;
        sqr.innerHTML = "";
        sqr.classList.remove("active-sqr");
        sqr.classList.remove("opps-sqr");
        sqr.classList.remove("circle-sqr");
      });
    });
  }
  #updateChessBoard(type, currentVal, nextVal) {
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

    let [fromX, fromY] = this.board._getCoordinates(+currentVal);
    let [toX, toY] = this.board._getCoordinates(+nextVal);
    [fenArray[fromX][fromY], fenArray[toX][toY]] = ["", type];

    // display
    this.displayPanel.textContent = `${this.#getPieceColor(type)} ${type} ${
      this.board._corresponBoard()[fromX][fromY]
    } to ${this.board._corresponBoard()[toX][toY]}`;
    //
    let updatedFenString = arrayToFen(fenArray);
    this.#whoPlayedLast = this.#getPieceColor(type);
    this.#fenString = updatedFenString;
    //
    this.#cleanChessBoard();
    this.#placePieces();
  }
  #movePiece(e) {
    const sqr = e.target.closest("div");
    const piece = JSON.parse(sqr.dataset.chessPiece);

    const getSqr = (val) => document.querySelector(`[data-val="${val}"]`);

    if (piece) {
      let validMoves = this.#getValidMoves(piece);
      this.#highlightMoves(piece.currentVal, validMoves);

      validMoves.forEach((move) => {
       if(move){
        console.log("move:", move)
         const sqr = getSqr(move);
         sqr.addEventListener("drop", (e) => {
           e.preventDefault();
           const data = e.dataTransfer.getData("text");
           e.target.insertAdjacentHTML(
             "afterbegin",
             `<img src=${data} class="chess-piece-icon" />`
           );
           this.#updateChessBoard(
             piece.type,
             piece.currentVal,
             sqr.dataset.val
           );
         });
       }
      });
    }
  }
  #placePieces() {
    let pieceTypeFromSymbol = (currentVal, symbol) => {
      let allTypeChessPieces = {
        r: new Rook(
          currentVal,
          symbol,
          `chessIcons/Rook,${this.#getPieceColor(symbol)}.svg`
        ),
        n: new Knight(
          currentVal,
          symbol,
          `chessIcons/Knight,${this.#getPieceColor(symbol)}.svg`
        ),
        b: new Bishop(
          currentVal,
          symbol,
          `chessIcons/Bishop,${this.#getPieceColor(symbol)}.svg`
        ),
        k: new King(
          currentVal,
          symbol,
          `chessIcons/King,${this.#getPieceColor(symbol)}.svg`
        ),
        q: new Queen(
          currentVal,
          symbol,
          `chessIcons/Queen,${this.#getPieceColor(symbol)}.svg`
        ),
        p: new Pawn(
          currentVal,
          symbol,
          `chessIcons/Pawn,${this.#getPieceColor(symbol)}.svg`
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
          icon.setAttribute("draggable", true);
          icon.addEventListener("dragstart", (e) =>
            e.dataTransfer.setData("text", e.target.id)
          );
          icon.classList.add("chess-piece-icon");
          sqr.append(icon);
          y++;
        }
      }
    });
  }
  #getPieceColor(symbol) {
    return symbol == symbol.toLowerCase() ? "black" : "white";
  }
  #getValidMoves(piece) {
    let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);

    // true if occuppied
    // false if not
    let sqrIsOccupied = (val) => getSqr(val).dataset.isOccupied;

    // true if occuppied
    // false if occuppied by opp
    // null if not occupied
    let sqrIsOccupiedByType = (val, curP) => {
      if (val) {
        let nextP = JSON.parse(getSqr(val).dataset.chessPiece);
        return nextP
          ? this.#getPieceColor(curP.type) === this.#getPieceColor(nextP.type)
          : null;
      }
    };

    let validMoves = [];
    let moves = piece.moves;
    const pawn = ["p"].includes(piece.type.toLowerCase());
    const slideable = ["r", "b", "q"].includes(piece.type.toLowerCase());
    const normal = ["k", "n"].includes(piece.type.toLowerCase());
    if (pawn) {
      let double = (val, type) => (type == "p" ? val + 8 : val - 8);
      if (!piece.hasMoved) {
        validMoves.push(moves[0], double(moves[0], piece.type));
      } else {
        if (sqrIsOccupied(moves[0]) == "false") {
          validMoves.push([moves[0]]);
        }
        if (sqrIsOccupiedByType(moves[1], piece) == false) {
          validMoves.push([moves[1]]);
        }
        if (sqrIsOccupiedByType(moves[2], piece) == false) {
          validMoves.push([moves[2]]);
        }
      }
    }
    if (slideable) {
      for (let x = 0; x < moves.length; x++) {
        validMoves.push([]);
        if (moves[x]) {
          for (let y = 1; y < moves[x].length; y++) {
            if (sqrIsOccupiedByType(moves[x][y], piece)) {
              break;
            }
            if (sqrIsOccupiedByType(moves[x][y], piece) == false) {
              validMoves[x].push(moves[x][y]);
              break;
            }
            validMoves[x].push(moves[x][y]);
          }
        }
      }
    }
    if (normal) {
      validMoves = moves.map((val) => {
        if (val) return sqrIsOccupiedByType(val, piece) ? [] : [val];
        return [];
      });
    }
    return validMoves;
  }
  #highlightMoves(currentVal, nextVals) {
    let flatenedVals = nextVals.flat(Infinity);
    let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);
    getSqr(currentVal).classList.toggle("active-sqr");

    flatenedVals.forEach((val) => {
      let nxtSqr = getSqr(val);
      let nxtSqrPiece = JSON.parse(getSqr(val).dataset.chessPiece);
      nxtSqrPiece
        ? nxtSqr.classList.toggle("opps-sqr")
        : nxtSqr.classList.toggle("circle-sqr");
    });
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
          distances["N"] = north;
          distances["S"] = south;
          distances["E"] = east;
          distances["W"] = west;

          distances["NW"] = Math.min(north, west);
          distances["NE"] = Math.min(north, east);
          distances["SW"] = Math.min(south, west);
          distances["SE"] = Math.min(south, east);
        }
      });
    });
    return distances;
  }
  _getCoordinates(val) {
    let cor = [];
    this._logicBoard().forEach((row, idx) => {
      row.forEach((col, ydx) => {
        if (col == val) cor = [idx, ydx];
      });
    });
    return cor;
  }
}
let chessBoard = new ChessBoard();
chessBoard.drawChessBoard();
