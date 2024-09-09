"use strict";

import { HelperBoard } from "./HelperBoard";
import { Pawn, Rook, Bishop, Knight, King, Queen } from "./ChessPieces";

class ChessBoard {
  constructor() {
    this.helperBoard = new HelperBoard();
    this.displayPanel = document.querySelector(".display");
    this.chessBoard = document.querySelector(".chess-board");
    this.moves = [];
  }
  #numberOfRows = 8;
  #numberOfCols = 8;
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

        sqr.dataset.val = this.helperBoard._logicBoard()[x][y];
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
    this.helperBoard._logicBoard().forEach((row) => {
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
    let fenArray = this.helperBoard._fenToArray(this.#fenString);

    let [fromX, fromY] = this.helperBoard._getCoordinates(+currentVal);
    let [toX, toY] = this.helperBoard._getCoordinates(+nextVal);
    [fenArray[fromX][fromY], fenArray[toX][toY]] = ["", type];

    // display
    this.displayPanel.textContent = `${this.#getPieceColor(type)} ${type} ${
      this.helperBoard._corresponBoard()[fromX][fromY]
    } to ${this.helperBoard._corresponBoard()[toX][toY]}`;
    //
    let updatedFenString = this.helperBoard._arrayToFen(fenArray);
    this.#fenString = updatedFenString;
    //
    this.#cleanChessBoard();
    this.#placePieces();
  }

  #movePiece(e) {
    const sqr = e.target.closest("div");
    const piece = JSON.parse(sqr.dataset.chessPiece);

    if (piece) {
      let validMoves = this.#getValidMoves(piece);
      // console.log("valid moves",validMoves);
      this.#highlightMoves(piece.currentVal, validMoves);
      validMoves.forEach((move) => {
        if (move) {
          console.log("move:",move)
          const sqr = this.#getSqr(+move);
          // console.log('sqr', sqr)
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
          let currentVal = this.helperBoard._logicBoard()[x][y];
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

  #getSqr(val) {
    return document.querySelector(`[data-val="${val}"]`);
  }

  #getValidMoves(piece) {
    // true if occuppied false if not
    let sqrIsOccupied = (val) => this.#getSqr(val).dataset.isOccupied;
    // true if occuppied, false if occuppied by opp, null if not occupied
    let sqrIsOccupiedByType = (val, curP) => {
      if (val) {
        let nextP = JSON.parse(this.#getSqr(val).dataset.chessPiece);
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
      let pieceColor = this.#getPieceColor(piece.type);
      let distances = this.helperBoard._distanceToEdges(piece.currentVal);
      let distanceToOppSide = () =>
        pieceColor == "black" ? distances.S : distances.N;
      let doubleMove = (val) => (pieceColor == "black" ? val + 8 : val - 8);

      // if (
      //   (distances.N === 6 && pieceColor == "white" )  ||
      //   (distances.N === 1 && pieceColor == "black")
      // ) {
      //   validMoves.push(moves[0], doubleMove(moves[0]));
      // }

      if (sqrIsOccupied(moves[0]) == "false") {
        validMoves.push([moves[0]]);
      }
      if (sqrIsOccupiedByType(moves[1], piece) == false) {
        validMoves.push([moves[1]]);
      }
      if (sqrIsOccupiedByType(moves[2], piece) == false) {
        validMoves.push([moves[2]]);
      }
      // quening if the distance to opposite side of the board is less than 1 promote
      if (distanceToOppSide() <= 1) {
        piece.type = pieceColor == "black" ? "q" : "Q";
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
    this.#getSqr(currentVal).classList.toggle("active-sqr");

    flatenedVals.forEach((val) => {
      let nxtSqr = this.#getSqr(val);
      let nxtSqrPiece = JSON.parse(this.#getSqr(val).dataset.chessPiece);
      nxtSqrPiece
        ? nxtSqr.classList.toggle("opps-sqr")
        : nxtSqr.classList.toggle("circle-sqr");
    });
  }
}

let chessBoard = new ChessBoard();
chessBoard.drawChessBoard();

// todo
// checkmate
// castling
// remove event listeners after they have been added
// pawns can move twice at the begining
