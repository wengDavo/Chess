/**
 * A utility class that handles the static board data, calculations, and conversions.
 * It does not manage game state, but provides the tools to understand the board's structure.
 */
export class ChessUtils {
    #numberOfRows = 8;
    #numberOfCols = 8;

    /**
     * Creates an 8x8 grid mapping each square to a unique number from 0 to 63.
     * @returns {Array<Array<number>>} A 2D array representing the board, e.g., [[0,1..7], [8,9..15], ...]
     */
    _logicBoard() {
        const logicBoard = [];
        let count = 0;
        for (let x = 0; x < this.#numberOfRows; x++) {
            logicBoard.push([...Array(8).keys()].map((y) => y + 8 * count));
            count++;
        }
        return logicBoard;
    }

    /**
     * Creates an 8x8 grid mapping each square to its standard algebraic notation (e.g., 'a8', 'h1').
     * @returns {Array<Array<string>>} A 2D array with algebraic notation for each square.
     */
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

    /**
     * Calculates the number of squares from a given square value to each edge of the board.
     * @param {number} val The numeric value of the square (0-63).
     * @returns {object} An object with distances for N, S, E, W and the four diagonals.
     */
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

	/**
     * Converts a numeric square value (0-63) into its [row, col] coordinates.
     * @param {number} val The numeric value of the square.
     * @returns {Array<number>} An array containing the [row, col].
     */
    _getCoordinates(val) {
        // This is the optimized, direct calculation.
        const row = Math.floor(val / 8);
        const col = val % 8;
        return [row, col];
    }
    /**
     * Parses the piece placement data of a FEN string into a 2D array representation of the board.
     * @param {string} fenString The FEN string (e.g., "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR").
     * @returns {Array<Array<string>>} A 2D array with piece symbols.
     */
    _fenToArray(fenString) {
        fenString = `/${fenString}`.split(""); // Prepending '/' simplifies the loop
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

    /**
     * Converts a 2D array representation of the board back into a FEN string.
     * @param {Array<Array<string>>} fenArray A 2D array with piece symbols.
     * @returns {string} A FEN string representing piece placement.
     */
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
            if (x < this.#numberOfRows - 1) {
                fenString += "/";
            }
        }
        return fenString;
    }
}
