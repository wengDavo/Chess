class ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    this.currentValue = currentValue;
    this.nextValue = nextValue;
    this.color = color;
    this.name = name;
    this.chessBoard = new ChessBoard();
  }

  distanceToEdges(value) {
    // gets the distances for this.value
    // from this.point to all edges of the board
    // returns a dictionary of all the distances from this.point to the edges
    let distances = {};
    // the board used to assign a tile its value
    this.chessBoard.createLogicBoard();
    this.chessBoard.logicBoard.forEach((edge, x) => {
      edge.forEach((item, y) => {
        if (item == value) {
          let [north, south, east, west] = [x, 7 - x, 7 - y, y];
          let [northWest, northEast, southWest, southEast, center] = [
            Math.min(north, west),
            Math.min(north, east),
            Math.min(south, west),
            Math.min(south, east),
            Math.min(north, west, east, south),
          ];

          distances["north"] = north;
          distances["south"] = south;
          distances["east"] = east;
          distances["west"] = west;

          distances["northWest"] = northWest;
          distances["northEast"] = northEast;
          distances["southWest"] = southWest;
          distances["southEast"] = southEast;
        }
      });
    });
    return distances;
  }

  // if the distance to this edge of this value is 0
  // then it is at the boundary iof the edge
  // else return a valid move
  calcMove(value, increment, distanceToEdge) {
    if (distanceToEdge <= 0) return null;
    // by subtracting these two values we get the next move from this.position
    let moveTo = value - increment;
    return moveTo;
  }

  north(value) {
    let incrementBy = 8;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["north"]);
  }
  south(value) {
    let incrementBy = -8;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["south"]);
  }
  east(value) {
    let incrementBy = -1;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["east"]);
  }
  west(value) {
    let incrementBy = 1;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["west"]);
  }

  northEast(value) {
    let incrementBy = 7;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["northEast"]);
  }
  northWest(value) {
    let incrementBy = 9;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["northWest"]);
  }
  southEast(value) {
    let incrementBy = -9;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["southEast"]);
  }
  southWest(value) {
    let incrementBy = -7;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["southWest"]);
  }

  // the wide moves need more than 1 free space to be legal
  // minus by 1 so that if the distance to edge side is 1 the move is not possible
  // now distance to edge must always be more than 1 for wide moves
  knightNorthEastWide(value) {
    let incrementBy = 6;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["northEast"] - 1);
  }
  knightNorthWestWide(value) {
    let incrementBy = 10;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["northWest"] - 1);
  }
  knightNoEastLong(value) {
    let incrementBy = 15;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["northEast"]);
  }
  knightNorthWestLong(value) {
    let incrementBy = 17;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["northWest"]);
  }

  knightSouthEastWide(value) {
    let incrementBy = -10;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["southEast"] - 1);
  }
  knightSouthWestWide(value) {
    let incrementBy = -6;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["southWest"] - 1);
  }
  knightSouthEastLong(value) {
    let incrementBy = -17;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["southEast"]);
  }
  knightSouthWestLong(value) {
    let incrementBy = -15;
    let distanceTo = this.distanceToEdges(value);
    return this.calcMove(value, incrementBy, distanceTo["southWest"]);
  }
}
class Pawn extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "pawn"));
  }
  moves = {
    north: this.north(this.currentValue),
    south: this.south(this.currentValue),
    northEast: this.northEast(this.currentValue),
    northWest: this.northWest(this.currentValue),
    southWest: this.southWest(this.currentValue),
    southEast: this.southEast(this.currentValue),
  };
  // edges = distanceToEdges(this.currentValue)
}
class Rook extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "rook"));
  }
  moves = {
    north: this.north(this.currentValue),
    south: this.south(this.currentValue),
    east: this.east(this.currentValue),
    west: this.west(this.currentValue),
  };
}
class Bishop extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "bishop"));
  }
  moves = {
    northEast: this.northEast(this.currentValue),
    northWest: this.northWest(this.currentValue),
    southEast: this.southEast(this.currentValue),
    southWest: this.southWest(this.currentValue),
  };
}
class Knight extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "knight"));
  }
  moves = {
    knightNorthEastWide: this.knightNorthEastWide(this.currentValue),
    knightNorthWestWide: this.knightNorthWestWide(this.currentValue),
    knightNorthEastLong: this.knightNoEastLong(this.currentValue),
    knightNorthWestLong: this.knightNorthWestLong(this.currentValue),

    knightSouthEastWide: this.knightSouthEastWide(this.currentValue),
    knightSouthWestWide: this.knightSouthWestWide(this.currentValue),
    knightSouthEastLong: this.knightSouthEastLong(this.currentValue),
    knightSouthWestLong: this.knightSouthWestLong(this.currentValue),
  };
}
class King extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "king"));
  }
  moves = {
    north: this.north(this.currentValue),
    south: this.south(this.currentValue),
    east: this.east(this.currentValue),
    west: this.west(this.currentValue),
    northEast: this.northEast(this.currentValue),
    northWest: this.northWest(this.currentValue),
    southEast: this.southEast(this.currentValue),
    southWest: this.southWest(this.currentValue),
  };
}
class Queen extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "queen"));
  }
  moves = {
    north: this.north(this.currentValue),
    south: this.south(this.currentValue),
    east: this.east(this.currentValue),
    west: this.west(this.currentValue),
    northEast: this.northEast(this.currentValue),
    northWest: this.northWest(this.currentValue),
    southEast: this.southEast(this.currentValue),
    southWest: this.southWest(this.currentValue),
  };
}

class ChessBoard {
  constructor() {
    this.chessBoard = document.querySelector(".chess-board");
    this.chessBoard.addEventListener("click", this.setThisTileInfo);
    this.chessBoard.addEventListener("click", this.showThisPieceMoves);
  }

  setThisTileInfo(e) {
    this.tile = {};
    let target = e.target.closest("div");
    this.tile["value"] = +target.dataset.value;
    this.tile["isOccupied"] = target.dataset.isOccupied;
    this.tile["chessPiece"] = JSON.parse(target.dataset.chessPiece);
  }

  showThisPieceMoves() {
    let highlightTiles = function (moves) {
      Object.entries(moves).forEach((move) => {
        let [moveName, moveValue] = [...move];
        let thisMove = document.querySelector(`[data-value="${moveValue}"]`);
        thisMove ? thisMove.classList.toggle("highlight") : null;
      });
    };
    let { value, isOccupied, chessPiece } = { ...this.tile };
    console.log("value:", chessPiece)
    if (chessPiece) {
      let chessPieceMoves = chessPiece["moves"];
      // console.log(chessPiece.currentValue)
      // let chessPieceEdges = chessPiece["edges"];
      // console.log(Object.keys(chessPiece).includes("edges"));
      // console.log(chessPieceMoves);
      highlightTiles(chessPieceMoves);
      //  console.log(chessPieceMoves);
    }
  }

  createLogicBoard() {
    // A 2d array of numbers from 0 - 63 => 8 * 8
    this.logicBoard = [];
    const numberOfRows = 8;
    const numberOfCols = 8;
    let constant = 0;
    for (let x = 0; x < numberOfRows; x++) {
      this.logicBoard.push([]);
      let run = 8 + constant;
      for (let y = constant; y < run; y++) {
        this.logicBoard[x].push(y);
        constant = y + 1;
      }
    }
  }

  createBoard() {
    const numberOfRows = 8;
    const numberOfCols = 8;
    this.createLogicBoard();

    for (let x = 0; x < numberOfRows; x++) {
      let row = document.createElement("article");
      row.classList.add("chess-row");
      this.chessBoard.append(row);

      for (let y = 0; y < numberOfCols; y++) {
        let col = document.createElement("div");
        col.classList.add("chess-box");
        row.append(col);
        col.setAttribute("data-value", this.logicBoard[x][y])
        col.innerHTML = this.logicBoard[x][y];

        // draw the alternating tiles
        if ((x + y) % 2 == 0) {
          col.classList.add("white-tile");
        } else {
          col.classList.add("dark-tile");
        }
      }
    }
    this.placeChessPieces();
  }

  placeChessPieces() {
    let setPieceAttributes = function (col, obj, currentValue, occupied) {
      //if we don't convert will be sent as str [obj obj]
      col.setAttribute("data-chess-piece", JSON.stringify(obj));
      col.setAttribute("data-value", currentValue);
      col.setAttribute("data-is-occupied", occupied);
    };
    let pieceTypeFromSymbol = (currentValue, symbol) => {
      let allTypeChessPieces = {
        r: new Rook(currentValue, null, getColor(symbol)),
        n: new Knight(currentValue, null, getColor(symbol)),
        b: new Bishop(currentValue, null, getColor(symbol)),
        k: new King(currentValue, null, getColor(symbol)),
        q: new Queen(currentValue, null, getColor(symbol)),
        p: new Pawn(currentValue, null, getColor(symbol)),
      };
      return allTypeChessPieces[symbol.toLowerCase()];
    };
    let getColor = (symbol) =>
      symbol == symbol.toLowerCase() ? "black" : "white"; 

    let [x, y] = [0, 0];
    const fenBoard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR".split("")
    fenBoard.forEach((symbol)=>{
      if (symbol == "/") {
        x++;
        y = 0;
      }
      else if (symbol == "8"){
        for (let i = 0; i < 8; i++) {
          let currentValue = this.logicBoard[x][i];
          let col = document.querySelector(`[data-value="${currentValue}"]`);
          setPieceAttributes(col, null, currentValue, false);
        }
      }
      else {
        let currentValue = this.logicBoard[x][y];
        let col = document.querySelector(`[data-value="${currentValue}"]`);
        let chessPiece = pieceTypeFromSymbol(currentValue, symbol);
        chessPiece
          ? setPieceAttributes(col, chessPiece, currentValue, true)
          : null;
        y++;
      }
    })
  }
}

this.chessBoard = new ChessBoard();
this.chessBoard.createBoard();

