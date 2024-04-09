class ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    this.currentValue = currentValue;
    this.nextValue = nextValue;
    this.color = color;
    this.name = name;
  }
  move(value, increment, checkCase){
    return "white" == checkCase
      ? value - increment
      : value + increment;
  }
  forwards() {}
  backwards() {}
  right() {}
  left() {}

  diagonalTopRight() {}
  diagonalTopLeft() {}
  diagonalBottomRight() {}
  diagonalBottomLeft() {}

  knightTopRight() {}
  knightTopLeft() {}
  knightTopFarRight() {}
  knightTopFarLeft() {}

  knightBottomRight() {}
  knightBottomLeft() {}
  knightBottomFarRight() {}
  knightBottomFarLeft() {}
}
class Pawn extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "pawn"));
  }
  forwards() {return this.move(this.currentValue, 8, this.color);}
  diagonalTopRight() {return this.move(this.currentValue, 7, this.color);}
  diagonalTopLeft() {return this.move(this.currentValue, 9, this.color);}

  moves = {
    forwards: this.forwards(),
    diaginalTopRight: this.diagonalTopRight(),
    diagonalTopLeft: this.diagonalTopLeft(),
  };
}
class Rook extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "rook"));
    this.increment = null;
  }

  forwards() {return this.move(this.currentValue, 8, this.color)}
  backwards() {return this.move(this.currentValue, 8, this.color)}
  right() {return this.move(this.currentValue, -1, this.color)}
  left() {return this.move(this.currentValue, 1, this.color)}

  moves = {
    forwards: this.forwards(),
    backwards: this.backwards(),
    right: this.right(),
    left: this.left(),
  };
}
class Bishop extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "bishop"));
  }

  diagonalTopRight() {return this.move(this.currentValue, 7, this.color);}
  diagonalTopLeft() {return this.move(this.currentValue, 9, this.color);}
  diagonalBottomRight() {return this.move(this.currentValue, -9, this.color);}
  diagonalBottomLeft() {return this.move(this.currentValue, -9, this.color);}

  moves = {
    diagonalTopRight: this.diagonalTopRight(),
    diagonalTopLeft: this.diagonalTopLeft(),
    diagonalBottomRight: this.diagonalBottomRight(),
    diagonalBottomLeft: this.diagonalBottomLeft(),
  };
}
class Knight extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "knight"));
  }
  knightTopRight() {return this.move(this.currentValue, 6, this.color);}
  knightTopLeft() {return this.move(this.currentValue, 10, this.color);}
  knightTopFarRight() {return this.move(this.currentValue, 15, this.color);}
  knightTopFarLeft() {return this.move(this.currentValue, 17, this.color);}

  knightBottomRight() {return this.move(this.currentValue, -10, this.color);}
  knightBottomLeft() {return this.move(this.currentValue, -6, this.color);}
  knightBottomFarRight() {return this.move(this.currentValue, -17, this.color);}
  knightBottomFarLeft() {return this.move(this.currentValue, -15, this.color);}
  moves = {
    knightTopRight: this.knightTopRight(),
    knightTopLeft: this.knightTopLeft(),
    knightTopFarRight: this.knightTopFarRight(),
    knightTopFarLeft: this.knightTopFarLeft(),

    knightBottomRight: this.knightBottomRight(),
    knightBottomLeft: this.knightBottomLeft(),
    knightBottomFarRight: this.knightBottomFarRight(),
    knightBottomFarLeft: this.knightBottomFarLeft(),
  };
}
class King extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "king"));
  }
  forwards() {return this.move(this.currentValue, 8, this.color)}
  backwards() {return this.move(this.currentValue, 8, this.color)}
  right() {return this.move(this.currentValue, -1, this.color)}
  left() {return this.move(this.currentValue, 1, this.color)}
  
  diagonalTopRight() {return this.move(this.currentValue, 7, this.color);}
  diagonalTopLeft() {return this.move(this.currentValue, 9, this.color);}
  diagonalBottomRight() {return this.move(this.currentValue, -9, this.color);}
  diagonalBottomLeft() {return this.move(this.currentValue, -9, this.color);}

  moves = {
    forwards: this.forwards(),
    backwards: this.backwards(),
    right: this.right(),
    left: this.left(),

    diagonalTopRight: this.diagonalTopRight(),
    diagonalTopLeft: this.diagonalTopLeft(),
    diagonalBottomRight: this.diagonalBottomRight(),
    diagonalBottomLeft: this.diagonalBottomLeft(),
  };
}
class Queen extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "queen"));
  }
 forwards() {return this.move(this.currentValue, 8, this.color)}
  backwards() {return this.move(this.currentValue, 8, this.color)}
  right() {return this.move(this.currentValue, -1, this.color)}
  left() {return this.move(this.currentValue, 1, this.color)}
  
  diagonalTopRight() {return this.move(this.currentValue, 7, this.color);}
  diagonalTopLeft() {return this.move(this.currentValue, 9, this.color);}
  diagonalBottomRight() {return this.move(this.currentValue, -9, this.color);}
  diagonalBottomLeft() {return this.move(this.currentValue, -9, this.color);}

  moves = {
    forwards: this.forwards(),
    backwards: this.backwards(),
    right: this.right(),
    left: this.left(),

    diagonalTopRight: this.diagonalTopRight(),
    diagonalTopLeft: this.diagonalTopLeft(),
    diagonalBottomRight: this.diagonalBottomRight(),
    diagonalBottomLeft: this.diagonalBottomLeft(),
  };
}

class ChessBoard {
  constructor() {
    this.chessBoard = document.querySelector(".chess-board");
    this.chessBoard.addEventListener("click", this.getThisTileInfo);
    this.chessBoard.addEventListener("click", this.getThisPieceMoves);
  }

  getThisTileInfo(e) {
    this.tile = {};
    let target = e.target.closest("div");
    this.tile["value"] = target.dataset.value;
    this.tile["isOccupied"] = target.dataset.isOccupied;
    this.tile["chessPiece"] = JSON.parse(target.dataset.chessPiece);
  }

  getThisPieceMoves(e) {
    let { value: tileValue, isOccupied, chessPiece } = { ...this.tile };

    // let showHighlightedTiles = (possibleMoves) => {
    //   Object.entries(possibleMoves).forEach((piece) => {
        
    //     let thisPossibleMove = document.querySelector(
    //       `[data-value="${piece[1]}"]`
    //     );
    //     console.log("why:", piece[1]);
    //     thisPossibleMove.classList.toggle("highlight-tile");
    //     //
    //     // console.log(`move-name:${piece[0]}, move-value:${piece[1]}`);
    //   });
    // };

    // showHighlightedTiles(chessPiece.moves)
    // console.log("current:", chessPiece.name);
    console.log(chessPiece["moves"]);
    console.log("current:",chessPiece.currentValue);
  }

  createLogicBoard() {
    // label the this baord with numbers (0-63)
    //the logic board contains a 2d array from numbers 0 - 63
    this.logicBoard = [];
    let constant = 0;
    for (let x = 0; x < 8; x++) {
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

    // draw the board with css
    for (let x = 0; x < numberOfRows; x++) {
      let row = document.createElement("article");
      row.classList.add("chess-row");
      this.chessBoard.append(row);

      for (let y = 0; y < numberOfCols; y++) {
        let col = document.createElement("div");
        col.classList.add("chess-box");
        row.append(col);

        col.innerHTML = this.logicBoard[x][y]
        // map corresponding values
        this.placeChessPieces(col, x, y);

        // draw the alternating tiles
        if (x % 2 === 0) {
          if (y % 2 === 0) {
            col.classList.add("white-tile");
          } else {
            col.classList.add("dark-tile");
          }
        } else {
          if (y % 2 !== 0) {
            col.classList.add("white-tile");
          } else {
            col.classList.add("dark-tile");
          }
        }
      }
    }
  }

  placeChessPieces(col, x, y) {
    let currentValue = this.logicBoard[x][y];
    let nextValue = null;

    // helper functions
    // function to set the properties of the tile
    let setPieceAttributes = (col, obj, currentValue, occupied) => {
      col.setAttribute("data-chess-piece", JSON.stringify(obj)); //if we don't convert will be [obj obj]
      col.setAttribute("data-value", currentValue);
      col.setAttribute("data-is-occupied", occupied);
    };
    let spread = (obj) => [...obj[0], ...obj[1]];
    let getColor = (obj) => (obj.includes(currentValue) ? "black" : "white");
    // checks if the current value is in the first list, if it is then it is black, else it is white and returns the correct color for the piece
    setPieceAttributes(col, null, currentValue, false); //for empty tiles

    //this objects lists all the chesspieces to their positions
    //on the logic board
    let piecePositions = {
      //black, white
      //first array is to set the positions for the black pieces
      //second array is to set the positions for the white pieces
      Pawn: [
        [...Array(8).keys()].map((x) => x + 8), //black from 8 through 15
        [...Array(8).keys()].map((x) => x + 48), //white from 48 through 55
      ],
      Rook: [
        [0, 7],
        [56, 63],
      ],
      Knight: [
        [1, 6],
        [57, 62],
      ],
      Bishop: [
        [2, 5],
        [58, 61],
      ],
      King: [[3], [59]],
      Queen: [[4], [60]],
    };
    //transform the object (positions) to an array
    //for each item in the array of array ["pawn", [ [], [] ]]
    //if the name of the piece is adequate
    //create an object based on the name of the piece
    //then place it on the board using set
    Object.entries(piecePositions).forEach(([pieceName, pieceList]) => {
      let thisPiece =
        pieceName == "Pawn"
          ? new Pawn(currentValue, nextValue, getColor(pieceList[0]))
          : pieceName == "Rook"
          ? new Rook(currentValue, nextValue, getColor(pieceList[0]))
          : pieceName == "Knight"
          ? new Knight(currentValue, nextValue, getColor(pieceList[0]))
          : pieceName == "Bishop"
          ? new Bishop(currentValue, nextValue, getColor(pieceList[0]))
          : pieceName == "King"
          ? new King(currentValue, nextValue, getColor(pieceList[0]))
          : pieceName == "Queen"
          ? new Queen(currentValue, nextValue, getColor(pieceList[0]))
          : null;

      if (spread(pieceList).includes(currentValue)) {
        setPieceAttributes(col, thisPiece, thisPiece.currentValue, true);
      }
    });
  }
}

class Game {
  constructor() {
    this.chessBoard = new ChessBoard();
    this.chessBoard.createBoard();
  }
}

let game = new Game();
