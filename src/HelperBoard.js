export class HelperBoard {
  #numberOfRows = 8;
  #numberOfCols = 8;

  // an 8 * 8 board corresponding to numbers from 0 - 63
  _logicBoard() {
    const logicBoard = [];
    let count = 0;
    for (let x = 0; x < this.#numberOfRows; x++) {
      logicBoard.push([...Array(8).keys()].map((y) => y + 8 * count));
      count++;
    }
    return logicBoard;
  }

  // the alphabets
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

  // distance from a given square to any edge from all the directions
  _distanceToEdges(val) {
    let distances = {};
    this._logicBoard().forEach((edge, x) => {
      edge.forEach((item, y) => {
        if (item == val) {
          let [north, south, east, west] = [x, 7 - x, 7 - y, y];
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

  // helper function pass in a value from 0 - 63 and it returns its row and col coordinates
  _getCoordinates(val) {
    let cor = [];
    this._logicBoard().forEach((row, idx) => {
      row.forEach((col, ydx) => {
        if (col == val) cor = [idx, ydx];
      });
    });
    return cor;
  }

  // receives a fen string and returns it in an array
  _fenToArray(fenString) {
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
  }

  // receives an arrayand conevrts it to a fen string
  _arrayToFen(fenArray) {
    let fenString = "";
    for (let x = 0; x < this.#numberOfRows; x++) {
      let count = 0;
      for (let y = 0; y < this.#numberOfCols; y++) {
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
  }
}
