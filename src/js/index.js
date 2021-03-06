import React from "react";
import ReactDOM from "react-dom";

function Square(props) {
  const classes = (props.highlight) ? 'square highlight' : 'square';
  return (
    <button
      className = {classes}
      onClick = { () => props.onClick() }
    >
      { props.value }
    </button>
  );
}

function Board(props) {
  function renderSquare(i) {
    const winLine = props.winLine;
    return <Square
      value = {props.squares[i]}
      onClick = {() => props.onClick(i)}
      highlight = {(winLine && winLine.includes(i))}
    />;
  } 

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      stepNumber: 0,
      xIsNext: true,
      finished: false,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    if (this.state.finished || current[i]) return;
    const lastSquares = current.slice();
    lastSquares[i] = (this.state.xIsNext) ? 'X' : 'O';
    this.setState({
      history: history.slice(0, this.state.stepNumber + 1).concat([lastSquares]),
      stepNumber: this.state.stepNumber + 1,
      xIsNext: this.state.stepNumber % 2
    });
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      }
    }
    return null;
  }

  gameFinished(squares) {
    return squares.every((ele) => ele !== null);
  }

  fetchMoves() {
    const history = this.state.history;
    return history.map((move, idx) => {
      return (
        <li key={idx}>
          <button onClick={() => this.jumpTo(idx)}>
            {(idx) ? 'Move to step #' + idx : 'Move to game start'}
          </button>
        </li>
      );
    });
  }

  jumpTo(move) {
    const history = this.state.history;
    this.setState({
      stepNumber: move,
      xIsNext: this.state.stepNumber % 2,
      finished: this.gameFinished(history[move])
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current);
    const moves = this.fetchMoves();
    let status;
    let winLine;
    if (winner) {
      status = `Winner: ${winner[0]}`;
      winLine = winner[1];
      this.state.finished = true;
    } else {
      const finish = this.gameFinished(current);
      if (finish) {
        status = 'Draw';
        this.state.finished = true;
      } else {
        status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current}
            onClick = {(i) => this.handleClick(i)}
            winLine = {winLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
