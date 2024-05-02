"use strict";
// TODO
// feature => set pawns to move twice at the start of the game
// feature => checkmate and castling
// bug => knights are not moving perfectly because of the reduce parameter set for them
//    which is good except when they are at the other edge of the board then some of their moves
//    will be reduced  because the position is -1
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
    if (nextval < board[0][0] || nextval > board.at(-1).at(-1))
      return false;
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
  // a pawn is  promotable if the distance to the forward  is less than or equal 1
  promotable =
    this.board._distanceToEdges(this.currentVal)[this.direction] <= 1;
  hasMoved = false;
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
    // problem
    northEastWide: this.getMove("northEast", this.currentVal, false, -1, -1),
    northWestWide: this.getMove("northWest", this.currentVal, false, +1, -1), // -1*
    southEastWide: this.getMove("southEast", this.currentVal, false, -1, -1), // -1*
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
    this.displayPanel = document.querySelector(".display");
    this.p = null;
  }
  #numberOfRows = 8;
  #numberOfCols = 8;
  #whoPlayedLast = "";
  #fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  get fenString() {
    return this.#fenString;
  }
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
    const promoteTo = (symbol, piece) =>
      symbol == symbol.toLowerCase() ? piece : piece.toUpperCase();
    const whoPlayedLast = piece
      ? this.#getPieceColor(piece.type) == this.#whoPlayedLast
      : null;
    const pawnPromotable = piece
      ? piece.type.toLowerCase() == "p" && piece.promotable
      : null;

     let isSqrOccupiedByType = (val, curP) => {
       let nextP = JSON.parse(getSqr(val).dataset.chessPiece);
       return nextP
         ? this.#getPieceColor(curP.type) === this.#getPieceColor(nextP.type)
         : null;
     };

    // first click
    if(piece){
      this.p = piece;
      // this.#highlightMoves(piece.moves);
      console.log(piece.moves)
    }
    // second click
    if(!piece){
      // let legalMoves = this.#getMoves(this.p);
      legalMoves.forEach((item)=>{
        item && item.includes(+sqr.dataset.val) ? this.#updateChessBoard(
          this.p.type,
          this.p.currentVal,
          sqr.dataset.val
        ):null
      })
    }
    // if(piece && !whoPlayedLast){
    //   this.#highlightMoves(piece);
    //   let legalMoves = this.#getMoves(piece);
    //   console.log(legalMoves)
    //   for (let moves of legalMoves) {
    //     if (pawnPromotable) {
    //       piece.type = promoteTo(piece.type, "q");
    //     }
    //     if (moves) {
    //       for (let move of moves) {
    //         let sqr = getSqr(move);
    //         sqr.addEventListener("click", () => {
    //           this.#updateChessBoard(
    //             piece.type,
    //             piece.currentVal,
    //             sqr.dataset.val
    //           );
    //         });
    //       }
    //     }
    //   }
    // }

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
  // #getMoves(chessPiece) {
  //   if (!(typeof chessPiece === "object" && chessPiece !== null))
  //       throw new TypeError("not an object chess piece");
  //   let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);

  //   // returns true if the next piece is occupied by any type -> str
  //   let isSqrOccupied = (val) => getSqr(val).dataset.isOccupied;
  //   // returns true=same type - false=opposite type
  //   // retruns null=empty sqr
  //   let isSqrOccupiedByType = (val, curP) => {
  //     let nextP = JSON.parse(getSqr(val).dataset.chessPiece);
  //     return nextP
  //       ? this.#getPieceColor(curP.type) === this.#getPieceColor(nextP.type)
  //       : null;
  //   };
  

  //   const pawn = ["p"].includes(chessPiece.type.toLowerCase());
  //   const slideable = ["r", "b", "q"].includes(chessPiece.type.toLowerCase());
  //   // not completely legal have not accounted for checkmate
  //   let legalMoves = null;
  //   if (pawn) {
  //     let pawnPseudoMoves = Object.entries(chessPiece.moves).map((move) => {
  //       let [moveName, moveVal] = [...move];
  //       let canAdvance =
  //         moveName == "forward" &&
  //         isSqrOccupied(moveVal, chessPiece) == "false";
  //       let canCaptureOpps =
  //         (moveName == "topRight" || moveName == "topLeft") &&
  //         isSqrOccupiedByType(moveVal, chessPiece) == false;
  //       // console.log("hasMoved:", chessPiece.hasMoved);
  //       // if (!chessPiece.hasMoved) return [16];
  //       console.log(moveVal)
  //       if (canAdvance) return moveVal;
  //       if (canCaptureOpps) return moveVal;
        
  //     });
  //     legalMoves = pawnPseudoMoves;
  //   } else if (slideable) {
  //     let slideablePseudoMoves = Object.entries(chessPiece.moves).map(
  //       (move) => {
  //         let [_, moveVal] = [...move];
  //         let sqrOccupiedType = moveVal.map((item) =>
  //           isSqrOccupiedByType(item, chessPiece)
  //         );
  //         let sqrOccupied = moveVal.map((item) =>
  //           isSqrOccupied(item, chessPiece) == "true" ? true : false
  //         );
  //         let positions = [],
  //           index = 1;
  //         while (
  //           sqrOccupiedType[index] != true &&
  //           index < sqrOccupiedType.length
  //         ) {
  //           positions.push(moveVal[index]);
  //           if (sqrOccupied[index]) break;
  //           index++;
  //         }
  //         return positions;
  //       }
  //     );
  //     legalMoves = slideablePseudoMoves;
  //   } else {
  //     let regularPseudoMoves = Object.entries(chessPiece.moves).map((move) => {
  //       let [_, moveVal] = [...move];
  //       return isSqrOccupiedByType(moveVal, chessPiece) ? null : moveVal;
  //     });
  //     legalMoves = regularPseudoMoves;
  //   }
  //   return legalMoves;
  // }
  #highlightMoves(chessPiece) {
    let getSqr = (val) => document.querySelector(`[data-val="${val}"]`);
    getSqr(chessPiece.currentVal).classList.toggle("active-sqr");
    // let validMoves = this.#getMoves(chessPiece);
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
