"use strict";

import { ChessUtils } from "./chess-utils";
import { Pawn, Rook, Bishop, Knight, King, Queen } from "./chess-pieces";

class ChessBoard {
    // Board properties
    #numberOfRows = 8;
    #numberOfCols = 8;
    #fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

    // State management for the game
    #selectedPiece = null;
    #sourceSquare = null;
    #validMoves = [];
    #currentPlayer = 'white';

    constructor() {
        this.helperBoard = new ChessUtils();
        this.displayPanel = document.querySelector(".display");
        this.chessBoard = document.querySelector(".chess-board");
    }

    /**
     * Creates the DOM elements for the board and places the pieces.
     */
    drawChessBoard() {
        for (let x = 0; x < this.#numberOfRows; x++) {
            const row = document.createElement("article");
            row.classList.add("chess-row");
            this.chessBoard.append(row);
            for (let y = 0; y < this.#numberOfCols; y++) {
                const sqr = document.createElement("div");
                sqr.classList.add("chess-sqr");
                row.append(sqr);
                sqr.dataset.val = this.helperBoard._logicBoard()[x][y];
                sqr.dataset.isOccupied = 'false';
                sqr.dataset.chessPiece = null;
                sqr.addEventListener("click", this.#handleSquareClick.bind(this));
                if ((x + y) % 2 === 0) sqr.classList.add("white-sqr");
                else sqr.classList.add("dark-sqr");
                if (y === 0) {
                    sqr.dataset.boardNum = 8 - x;
                    sqr.classList.add("num-sqr");
                }
                if (x === this.#numberOfCols - 1) {
                    sqr.dataset.boardAlph = String.fromCharCode(65 + y);
                    sqr.classList.add("alph-sqr");
                }
            }
        }
        this.#placePieces();
        this.displayPanel.textContent = "White's Turn";
    }

    /**
     * Handles all user clicks on the board for selecting and moving pieces.
     * @param {Event} e The click event.
     */
    #handleSquareClick(e) {
        const clickedSqr = e.currentTarget;

        // If a piece is already selected, this click is an attempt to move it.
        if (this.#selectedPiece) {
            const isMoveValid = this.#validMoves.includes(Number(clickedSqr.dataset.val));
            if (isMoveValid) {
                this.#updateChessBoard(clickedSqr.dataset.val);
            }
            // Whether the move was valid or not, reset the selection state.
            this.#clearHighlights();
            this.#selectedPiece = null;
            this.#sourceSquare = null;
            this.#validMoves = [];
        } else {
            // If no piece is selected, this click is an attempt to select one.
            if (clickedSqr.dataset.isOccupied === 'true') {
                const pieceOnSquare = JSON.parse(clickedSqr.dataset.chessPiece);

                // Only allow selection if it's the current player's turn.
                if (this.#getPieceColor(pieceOnSquare.type) === this.#currentPlayer) {
                    const pieceInstance = this.#createPieceInstance(pieceOnSquare.currentVal, pieceOnSquare.type);
                    this.#selectedPiece = pieceInstance;
                    this.#sourceSquare = clickedSqr;
                    this.#validMoves = this.#getValidMoves(pieceInstance);
                    this.#highlightMoves(clickedSqr, this.#validMoves);
                }
            }
        }
    }

    /**
     * Calculates all legal moves for a given piece based on the current board state.
     * @param {ChessPiece} piece The instance of the piece to validate moves for.
     * @returns {Array<number>} A flat array of valid destination square values.
     */
    #getValidMoves(piece) {
        const validMoves = [];
        const currentPieceColor = this.#getPieceColor(piece.type);
        const pieceType = piece.type.toLowerCase();

        // Check piece type to apply the correct validation logic.
        const isSliding = ['r', 'b', 'q'].includes(pieceType);
        const isJumping = ['n', 'k'].includes(pieceType);
        const isPawn = pieceType === 'p';

        if (isPawn) {
            const potentialMoves = piece.moves;
            // Validate PUSH moves
            const pushRay = potentialMoves[0] || [];
            for (const move of pushRay) {
                if (this.#getSqr(move).dataset.isOccupied === 'false') {
                    validMoves.push(move);
                } else {
                    break; // Stop if the path is blocked
                }
            }
            // Validate CAPTURE moves
            const captureRays = potentialMoves.slice(1);
            for (const ray of captureRays) {
                const move = ray[0];
                const targetSqr = this.#getSqr(move);
                if (targetSqr.dataset.isOccupied === 'true') {
                    const targetPiece = JSON.parse(targetSqr.dataset.chessPiece);
                    if (this.#getPieceColor(targetPiece.type) !== currentPieceColor) {
                        validMoves.push(move);
                    }
                }
            }
        }

        if (isJumping) {
            const potentialMoves = piece.moves[0] || [];
            for (const move of potentialMoves) {
                const targetSqr = this.#getSqr(move);
                // A jumping piece can move to a square if it's empty OR contains an opponent.
                if (targetSqr.dataset.isOccupied === 'false') {
                    validMoves.push(move);
                } else {
                    const targetPiece = JSON.parse(targetSqr.dataset.chessPiece);
                    if (this.#getPieceColor(targetPiece.type) !== currentPieceColor) {
                        validMoves.push(move);
                    }
                }
            }
        }

        if (isSliding) {
            const potentialMoves = piece.moves;
            potentialMoves.forEach(ray => {
                for (const move of ray) {
                    const targetSqr = this.#getSqr(move);
                    if (targetSqr.dataset.isOccupied === 'true') {
                        const targetPiece = JSON.parse(targetSqr.dataset.chessPiece);
                        if (this.#getPieceColor(targetPiece.type) !== currentPieceColor) {
                            validMoves.push(move); // Include opponent's square as a capture
                        }
                        break; // CRITICAL: Stop the ray when it hits any piece.
                    } else {
                        validMoves.push(move); // Add empty square to moves.
                    }
                }
            });
        }
        return validMoves;
    }

    /**
     * Updates the board state after a valid move.
     * @param {string} nextVal The destination square value.
     */
    #updateChessBoard(nextVal) {
        const currentVal = this.#sourceSquare.dataset.val;
        const pieceType = this.#selectedPiece.type;

        let fenArray = this.helperBoard._fenToArray(this.#fenString);
        const [fromX, fromY] = this.helperBoard._getCoordinates(Number(currentVal));
        const [toX, toY] = this.helperBoard._getCoordinates(Number(nextVal));

        const pieceSymbol = fenArray[fromX][fromY];
        fenArray[toX][toY] = pieceSymbol;
        fenArray[fromX][fromY] = '';
        this.#fenString = this.helperBoard._arrayToFen(fenArray);

        // Switch player and update display.
        this.#currentPlayer = this.#currentPlayer === 'white' ? 'black' : 'white';
        const capPlayer = this.#currentPlayer.charAt(0).toUpperCase() + this.#currentPlayer.slice(1);
        this.displayPanel.textContent = `${capPlayer}'s Turn`;

        // Redraw the board with the new state.
        this.#cleanBoardState();
        this.#placePieces();
    }

    /**
     * Populates the board with pieces based on the current FEN string.
     */
    #placePieces() {
        this.#fenString.split('/').forEach((row, x) => {
            let y = 0;
            for (const symbol of row) {
                if (!isNaN(symbol)) {
                    y += Number(symbol);
                } else {
                    const currentVal = this.helperBoard._logicBoard()[x][y];
                    const sqr = this.#getSqr(currentVal);
                    const pieceData = { type: symbol, currentVal: currentVal };

                    sqr.dataset.chessPiece = JSON.stringify(pieceData);
                    sqr.dataset.isOccupied = 'true';

                    const icon = document.createElement("img");
                    const color = this.#getPieceColor(symbol);
                    const pieceName = { p: 'Pawn', r: 'Rook', n: 'Knight', b: 'Bishop', q: 'Queen', k: 'King' }[symbol.toLowerCase()];
                    icon.src = `chessIcons/${pieceName},${color}.svg`;
                    icon.classList.add("chess-piece-icon");
                    sqr.append(icon);
                    y++;
                }
            }
        });
    }

    /**
     * Creates a new instance of a chess piece class.
     * @param {number} currentVal The square value.
     * @param {string} symbol The FEN symbol for the piece ('P', 'n', etc.).
     * @returns {ChessPiece} An instance of the correct piece subclass.
     */
    #createPieceInstance(currentVal, symbol) {
        const pieceMap = { 'r': Rook, 'n': Knight, 'b': Bishop, 'q': Queen, 'k': King, 'p': Pawn };
        const PieceClass = pieceMap[symbol.toLowerCase()];
        const color = this.#getPieceColor(symbol);
        const pieceName = PieceClass.name;
        const img = `chessIcons/${pieceName},${color}.svg`;
        return new PieceClass(currentVal, symbol, img);
    }

    /**
     * Clears all piece icons and state from the board before redrawing.
     */
    #cleanBoardState() {
        for (let i = 0; i < 64; i++) {
            const sqr = this.#getSqr(i);
            if (sqr) {
                sqr.innerHTML = '';
                sqr.dataset.isOccupied = 'false';
                sqr.dataset.chessPiece = null;
                sqr.classList.remove("active-sqr", "opps-sqr", "circle-sqr");
            }
        }
    }

    /**
     * Applies CSS classes to highlight the selected piece and its valid moves.
     * @param {HTMLElement} sourceSqr The square of the selected piece.
     * @param {Array<number>} moves The array of valid move values.
     */
    #highlightMoves(sourceSqr, moves) {
        this.#clearHighlights();
        sourceSqr.classList.add("active-sqr");
        moves.forEach(val => {
            const sqr = this.#getSqr(val);
            if (sqr) {
                if (sqr.dataset.isOccupied === 'true') {
                    sqr.classList.add("opps-sqr");
                } else {
                    sqr.classList.add("circle-sqr");
                }
            }
        });
    }

    /**
     * Removes all highlight classes from the board.
     */
    #clearHighlights() {
        document.querySelectorAll(".active-sqr, .opps-sqr, .circle-sqr")
            .forEach(sqr => sqr.classList.remove("active-sqr", "opps-sqr", "circle-sqr"));
    }

    /**
     * Determines the color of a piece from its FEN symbol.
     * @param {string} symbol The FEN symbol.
     * @returns {'white'|'black'}
     */
    #getPieceColor(symbol) {
        return symbol === symbol.toLowerCase() ? "black" : "white";
    }

    /**
     * Gets a square's DOM element by its value.
     * @param {number | string} val The square's data-val.
     * @returns {HTMLElement}
     */
    #getSqr(val) {
        return this.chessBoard.querySelector(`[data-val="${val}"]`);
    }
}

// --- Initialize the Game ---
const chessBoard = new ChessBoard();
chessBoard.drawChessBoard();
