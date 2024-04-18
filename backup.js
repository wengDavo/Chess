"use strict";
class ChessPiece {
  constructor(currentValue, type, img) {
    this.currentValue = currentValue;
    this.type = type;
    this.img = img;
  }
  chessBoard = new ChessBoard();
  incrementBy = {
    north: 8,
    south: -8,
    east: -1,
    west: 1,

    northEast: 7,
    northWest: 9,
    southEast: -9,
    southWest: -7,
  };

  distanceToEdges(value) {
    let distances = {};
    const board = chessBoard.createLogicBoard();

    board.forEach((edge, x) => {
      edge.forEach((item, y) => {
        if (item == value) {
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
  validateMove(nextValue, distanceToEdge) {
    const board = chessBoard.createLogicBoard();
    if (nextValue < board[0][0] || nextValue > board.at(-1).at(-1))
      return false;
    if (distanceToEdge <= 0) return false;
    return true;
  }
  calcMove(value, increment, distanceToEdge, slideable) {
    let nextValue = value - increment;
    let valid = this.validateMove(nextValue, distanceToEdge);
    if (valid) {
      if (slideable) {
        let nextValues = [];
        for (let i = 0; i <= distanceToEdge; i++) {
          let squareValue = value - increment * i;
          nextValues.push(squareValue);
        }
        return nextValues;
      }
      return [nextValue];
    }
  }

  // get direction function takes the name od the directio it is to calculate for and returns the value in the direction
  // slideable(Boolean) =>for sliding pieces, true if the value should be repaeted to the edgd of the board (Q, B, R)
  // offsets => Knight pieces takes an offest number and adds it to the value for the direction to get the L movement
  // reduce => Knight pieces takes a number to reduce how far a value should be to the edge of the board to return null
  getMove(nameOfDirection, value, slideable, offset = 0, reduce = 0) {
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(
      value,
      this.incrementBy[nameOfDirection] + offset,
      distanceTo[nameOfDirection] + reduce,
      slideable
    );
  }
}
class Pawn extends ChessPiece {
  direction = this.type == "P" ? "north" : "south";
  check = this.direction == "north";
  topRight = `${this.direction}East`;
  topLeft = `${this.direction}West`;

  // sign = (value) => (this.check ? value : -value);
  directionTopRight = this.check ? this.topRight : this.topLeft;
  directionTopLeft = this.check ? this.topLeft : this.topRight;

  moves = {
    forward: this.getMove(this.direction, this.currentValue),
    topRight: this.getMove(this.directionTopRight, this.currentValue),
    topLeft: this.getMove(this.directionTopLeft, this.currentValue),
  };
}
class Rook extends ChessPiece {
  moves = {
    north: this.getMove("north", this.currentValue, true),
    south: this.getMove("south", this.currentValue, true),
    east: this.getMove("east", this.currentValue, true),
    west: this.getMove("west", this.currentValue, true),
  };
}
class Bishop extends ChessPiece {
  moves = {
    northEast: this.getMove("northEast", this.currentValue, true),
    northWest: this.getMove("northWest", this.currentValue, true),
    southEast: this.getMove("southEast", this.currentValue, true),
    southWest: this.getMove("southWest", this.currentValue, true),
  };
}
class Knight extends ChessPiece {
  moves = {
    northEastWide: this.getMove("northEast", this.currentValue, false, -1, -1),
    northWestWide: this.getMove("northWest", this.currentValue, false, +1, -1),
    southEastWide: this.getMove("southEast", this.currentValue, false, -1, -1),
    southWestWide: this.getMove("southWest", this.currentValue, false, +1, -1),

    northEastLong: this.getMove("northEast", this.currentValue, false, +8),
    northWestLong: this.getMove("northWest", this.currentValue, false, +8),
    southEastLong: this.getMove("southEast", this.currentValue, false, -8),
    southWestLong: this.getMove("southWest", this.currentValue, false, -8),
  };
}
class King extends ChessPiece {
  moves = {
    north: this.getMove("north", this.currentValue),
    south: this.getMove("south", this.currentValue),
    east: this.getMove("east", this.currentValue),
    west: this.getMove("west", this.currentValue),
    northEast: this.getMove("northEast", this.currentValue),
    northWest: this.getMove("northWest", this.currentValue),
    southEast: this.getMove("southEast", this.currentValue),
    southWest: this.getMove("southWest", this.currentValue),
  };
}
class Queen extends ChessPiece {
  moves = {
    north: this.getMove("north", this.currentValue, true),
    south: this.getMove("south", this.currentValue, true),
    east: this.getMove("east", this.currentValue, true),
    west: this.getMove("west", this.currentValue, true),
    northEast: this.getMove("northEast", this.currentValue, true),
    northWest: this.getMove("northWest", this.currentValue, true),
    southEast: this.getMove("southEast", this.currentValue, true),
    southWest: this.getMove("southWest", this.currentValue, true),
  };
}

class ChessBoard {
  constructor() {
    // this.fenString = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR";
    this.fenString = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R";
    // this.fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.numberOfRows = 8;
    this.numberOfCols = 8;
    this.logicBoard = this.createLogicBoard();
    this.chessBoard = document.querySelector(".chess-board");
    // this.updateBoard();
  }
  drawBoard() {
    // const logicBoard = this.createLogicBoard();

    for (let x = 0; x < this.numberOfRows; x++) {
      let row = document.createElement("article");
      row.classList.add("chess-row");
      this.chessBoard.append(row);

      for (let y = 0; y < this.numberOfCols; y++) {
        let square = document.createElement("div");
        square.classList.add("chess-box");
        row.append(square);
        // sets fields for each square set all to null
        // problem here ***
        square.dataset.value = this.logicBoard[x][y];
        square.dataset.isOccupied = false;
        square.dataset.chessPiece = null;
        square.addEventListener("click", this.movePiece);

        // square.innerHTML = board[x][y];

        // draw the alternating tiles
        if ((x + y) % 2 == 0) {
          square.classList.add("white-tile");
        } else {
          square.classList.add("dark-tile");
        }
      }
    }
    this.placeChessPieces();
  }
  updateBoard(currentValue, nextValue) {
    const numberOfCols = this.numberOfCols;
    const numberOfRows = this.numberOfRows;
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
    // let { value, chessPiece } = { ...this.tile };
    // console.log(this.tile);
    // const correspondBoard = this.createCorrespondBoard();
    let fenArray = fenToArray(this.fenString);
    let [fromX, fromY] = this.getCoordinates(0);
    let [toX, toY] = this.getCoordinates(16);
    fenArray[fromX][fromY] = "";
    fenArray[toX][toY] = "r";

    // console.log(
    //   `from:${correspondBoard[fromX][fromY]},to:${correspondBoard[toX][toY]}`
    // );
    let updatedFenString = arrayToFen(fenArray);
    this.fenString = updatedFenString;
  }
  placeChessPieces() {
    const logicBoard = this.createLogicBoard();

    let getColor = (symbol) =>
      symbol == symbol.toLowerCase() ? "black" : "white";

    let pieceTypeFromSymbol = (currentValue, symbol) => {
      let allTypeChessPieces = {
        r: new Rook(
          currentValue,
          symbol,
          `chessIcons/Rook,${getColor(symbol)}.svg`
        ),
        n: new Knight(
          currentValue,
          symbol,
          `chessIcons/Knight,${getColor(symbol)}.svg`
        ),
        b: new Bishop(
          currentValue,
          symbol,
          `chessIcons/Bishop,${getColor(symbol)}.svg`
        ),
        k: new King(
          currentValue,
          symbol,
          `chessIcons/King,${getColor(symbol)}.svg`
        ),
        q: new Queen(
          currentValue,
          symbol,
          `chessIcons/Queen,${getColor(symbol)}.svg`
        ),
        p: new Pawn(
          currentValue,
          symbol,
          `chessIcons/Pawn,${getColor(symbol)}.svg`
        ),
      };
      return allTypeChessPieces[symbol.toLowerCase()];
    };

    let [x, y] = [0, 0];
    this.fenString.split("").forEach((symbol) => {
      if (symbol == "/") {
        x++;
        y = 0;
      } else {
        if (!isNaN(symbol)) y += Number(symbol);
        else {
          let currentValue = logicBoard[x][y];
          let square = document.querySelector(`[data-value="${currentValue}"]`);
          let chessPiece = pieceTypeFromSymbol(currentValue, symbol);
          square.dataset.chessPiece = JSON.stringify(chessPiece);
          square.dataset.isOccupied = true;
          // add icons to the boards
          let icon = document.createElement("img");
          icon.setAttribute("src", chessPiece["img"]);
          icon.classList.add("chess-piece-icon");
          square.append(icon);
          y++;
        }
      }
    });
  }
  movePiece(e) {
    let square = e.target.closest("div");
    let piece = JSON.parse(square.dataset.chessPiece);
    let getTileIsOccupied = function (movesValue) {
      for (let value of movesValue) {
        let squareTile = document.querySelector(`[data-value="${value}"]`);
        return squareTile.dataset.isOccupied;
      }
    };
    // let getValidMoves = function (chessPiece) {
    //     if (!(typeof chessPiece === "object" && chessPiece !== null))
    //         throw new TypeError("not an object chess piece - v");
    //     let possibleMoves = Object.entries(chessPiece.moves).map((move) => {
    //       let [_, movesValue] = [...move];
    //       let tileOccupied = getTileIsOccupied(movesValue);
    //       return tileOccupied == "false" ? movesValue : null;
    //     });
    //     return possibleMoves;
    // };
    let getValidMoves = function (chessPiece) {
      if (!(typeof chessPiece === "object" && chessPiece !== null))
        throw new TypeError("not an object chess piece - v");

      let slideablePieces = ["r", "b", "q"];
      let repetable = slideablePieces.includes(chessPiece.type.toLowerCase());
      let normalMoves = Object.entries(chessPiece.moves).map((move) => {
        let [_, movesValue] = [...move];
        let tileOccupied = getTileIsOccupied(movesValue);
        return tileOccupied == "false" ? movesValue : null;
      });
      let repetableMoves = Object.entries(chessPiece.moves).map((move) => {
        let [_, movesValue] = [...move];
        // console.log(movesValue)
        let sqr = document.querySelector(`[data-value="${value}"]`);
        let sqrOccupied = sqr.dataset.isOccupied;
        while (sqrOccupied != "true") {
          return sqrOccupied;
        }
        let me = movesValue.map((value) => {});
        console.log(me);
        // return tileOccupied == "false" ? movesValue : null;
      });
      // console.log(repetableMoves)
      // return repetable ? repetableMoves : normalMoves;
    };
    let highlightTiles = function (chessPiece) {
      if (!(typeof chessPiece === "object" && chessPiece !== null))
        throw new TypeError("not an object chess piece - h");
      document
        .querySelector(`[data-value="${chessPiece.currentValue}"]`)
        .classList.toggle("highlight-square");
      let validMoves = getValidMoves(chessPiece);
      if (validMoves) {
        validMoves.forEach((listOfMoves) => {
          if (listOfMoves) {
            console.log(typeof listOfMoves);
            listOfMoves.forEach((move) => {
              document
                .querySelector(`[data-value="${move}"]`)
                .classList.toggle("highlight-circle");
              // thisMove.addEventListener("click", () => updateBoard.bind(thisMove));
            });
          }
        });
      }
    };
    console.log(getValidMoves(piece));
    // highlightTiles(piece)
  }

  // update(e){
  //   let getTileInfo = function(){
  //      let target = e.target.closest("div");
  //      let value = +target.dataset.value;
  //      let isOccupied = target.dataset.isOccupied;
  //      let chessPiece = JSON.parse(target.dataset.chessPiece);
  //      return [value, isOccupied, chessPiece]
  //  }
  // }
  createCorrespondBoard() {
    const correspondBoard = [];
    const alph = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let x = 0; x < this.numberOfRows; x++) {
      correspondBoard.push(
        [...Array(8).keys()].map((y) => `${alph[y]}${8 - x}`)
      );
    }
    return correspondBoard;
  }
  createLogicBoard() {
    const logicBoard = [];
    let count = 0;
    for (let x = 0; x < this.numberOfRows; x++) {
      logicBoard.push([...Array(8).keys()].map((y) => y + 8 * count));
      count++;
    }
    return logicBoard;
  }
  getCoordinates(value) {
    // const logicBoard = this.createLogicBoard();
    let coordinates = null;
    this.logicBoard.findIndex((row, xdx) => {
      row.findIndex((col, ydx) => {
        if (col == value) {
          coordinates = [xdx, ydx];
        }
      });
    });
    return coordinates;
  }
}

this.chessBoard = new ChessBoard();
this.chessBoard.drawBoard();

// this.chessBoard.init();
