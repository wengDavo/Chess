class ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    this.currentValue = currentValue;
    this.nextValue = nextValue;
    this.color = color;
    this.name = name;
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
  forwards() {
    return (this.currentValue -= 8);
  }
  diagonalTopRight() {
    return (this.currentValue -= 7);
  }
  diagonalTopLeft() {
    return (this.currentValue -= 9);
  }
}
class Rook extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "rook"));
  }
  forwards() {
    return (this.currentValue -= 8);
  }
  backwards() {
    return (this.currentValue += 8);
  }
  right() {
    return (this.currentValue += 1);
  }
  left() {
    return (this.currentValue -= 1);
  }
}
class Bishop extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "bishop"));
  }

  diagonalTopRight() {
    return (this.currentValue -= 7);
  }
  diagonalTopLeft() {
    return (this.currentValue -= 9);
  }
  diagonalBottomRight() {
    return (this.currentValue += 9);
  }
  diagonalBottomLeft() {
    return (this.currentValue += 7);
  }
}
class Knight extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "knight"));
  }
  knightTopRight() {
    return (this.currentValue -= 6);
  }
  knightTopLeft() {
    return (this.currentValue -= 10);
  }
  knightTopFarRight() {
    return (this.currentValue -= 15);
  }
  knightTopFarLeft() {
    return (this.currentValue -= 17);
  }

  knightBottomRight() {
    return (this.currentValue += 10);
  }
  knightBottomLeft() {
    return (this.currentValue += 6);
  }
  knightBottomFarRight() {
    return (this.currentValue += 17);
  }
  knightBottomFarLeft() {
    return (this.currentValue += 15);
  }
}
class King extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "king"));
  }
  forwards() {
    return (this.currentValue -= 8);
  }
  backwards() {
    return (this.currentValue += 8);
  }
  right() {
    return (this.currentValue += 1);
  }
  left() {
    return (this.currentValue -= 1);
  }

  diagonalTopRight() {
    return (this.currentValue -= 7);
  }
  diagonalTopLeft() {
    return (this.currentValue -= 9);
  }
  diagonalBottomRight() {
    return (this.currentValue += 9);
  }
  diagonalBottomLeft() {
    return (this.currentValue += 7);
  }
}
class Queen extends ChessPiece {
  constructor(currentValue, nextValue, color, name) {
    super(currentValue, nextValue, color, (name = "queen"));
  }
  forwards() {
    return (this.currentValue -= 8);
  }
  backwards() {
    return (this.currentValue += 8);
  }
  right() {
    return (this.currentValue += 1);
  }
  left() {
    return (this.currentValue -= 1);
  }

  diagonalTopRight() {
    return (this.currentValue -= 7);
  }
  diagonalTopLeft() {
    return (this.currentValue -= 9);
  }
  diagonalBottomRight() {
    return (this.currentValue += 9);
  }
  diagonalBottomLeft() {
    return (this.currentValue += 7);
  }
}

class ChessBoard {

  constructor() {
    //the chess board is the drawing of a chess board
    this.chessBoard = document.querySelector(".chess-board");
    // 
    this.tile = {};
    this.chessBoard.addEventListener("click",(e)=>{
      let target = e.target.closest("div");

      this.tile["value"]= target.dataset.value;
      this.tile["isTileOccupied"]= target.dataset.isTileOccupied;
      this.tile["chessPiece"]= target.dataset.chessPiece;
      console.log(this.tile)
    });
  }

  createLogicBoard(){
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
    this.createLogicBoard()

    // draw the board with css
    for (let x = 0; x < numberOfRows; x++) {
      let row = document.createElement("article");
      row.classList.add("chess-row");
      this.chessBoard.append(row);

      for (let y = 0; y < numberOfCols; y++) {
        let col = document.createElement("div");
        col.classList.add("chess-box");  
        row.append(col);

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

  placeChessPieces(col, x, y){
    let currentValue = this.logicBoard[x][y];
    let nextValue = null;
    col.setAttribute("data-value", currentValue);
    col.setAttribute("data-is-tile-occupied", false);

    // to spread a matrix with 2 items
    let spread = (obj) => [...obj[0], ...obj[1]]

    // checks if the current value is in the first list, if it is then it is black, else it is white
    // and returns the correct color for the piece
    let getColor = (obj) => (obj.includes(currentValue) ? "black" : "white");

    // function to set the object of the tile and change parameters
    let setColAttributes = (col, obj, occupied) => {
      col.setAttribute("data-chess-piece", obj);
      col.setAttribute("data-is-tile-occupied", occupied);
    };

    let pawnList = [
      [...Array(8).keys()].map((x) => x + 8), //black from 8 through 15
      [...Array(8).keys()].map((x) => x + 48), //white from 48 through 55
    ];
    if (spread(pawnList).includes(currentValue)) {
      let pawn = new Pawn(currentValue, nextValue, getColor(pawnList[0]));
      setColAttributes(col, pawn.name, true)
    }

    let rookPositions = [
      [0, 7], // black rook position
      [56, 63], // white rook positions
    ];
    if (spread(rookPositions).includes(currentValue)) {
      let rook = new Rook(currentValue, nextValue, getColor(rookPositions[0]));
      setColAttributes(col, rook.name, true);
    }

    let knightPositions = [
      [1, 6], //black
      [57, 62], //white
    ]; 
    if (spread(knightPositions).includes(currentValue)) {
      let knight = new Knight(currentValue, nextValue, getColor(knightPositions[0]));
      setColAttributes(col, knight.name, true);
    }

    let bishopPositions = [
      [2, 5], //black
      [58, 61], //white
    ];
    if (spread(bishopPositions).includes(currentValue)) {
      let bishop = new Bishop(currentValue, nextValue, getColor(bishopPositions[0]));
      setColAttributes(col, bishop.name, true);
    }

    let kingPositions = [[3], [59]]; //black, white
    if (spread(kingPositions).includes(currentValue)) {
      let king = new King(currentValue, nextValue, getColor(kingPositions[0]));
      setColAttributes(col, king.name, true);
    }

    let queenPositions = [[4], [60]]; //black, white
    if (spread(queenPositions).includes(currentValue)) {
      let queen = new Queen(currentValue, nextValue, getColor(queenPositions[0]));
      setColAttributes(col, queen.name, true);
    }
  }

}

class Game{
  constructor(){
    this.chessBoard = new ChessBoard();
    this.chessBoard.createBoard();
  }
}

let game = new Game();


