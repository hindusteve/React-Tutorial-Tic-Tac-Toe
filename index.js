import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
    // AK debugging, can delete thru to line 60
    // console.log("constructor squares is " + this.state.squares)

    // console.log("history is " + this.state.history.squares)
    // console.log("xIsNext is " + this.state.history.xIsNext)           
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';      // prior ws setting the ith element of squares to x, now X or O based on if xIsNext is T or F
    this.setState({
      history: history.concat([{
        squares: squares, // this is setting the array squares defined in Board's constructor to the const squares created in this function
      }]),
      xIsNext: !this.state.xIsNext, // this is flipping the value of xIsNext, so the next move/player is correctly X or O
      });  
  }

  render() {

    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      console.log("step and move are respectively " + step + " & " + move) // more debugging for understanding purposes, to be deleted.
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
          );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

   return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onclick={(i) => this.handleClick(i)}
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],  // first horizontal row of a tic tac toe board
    [3, 4, 5],  // second horizontal row of a tic tac toe board
    [6, 7, 8],  // third horizontal row of a tic tac toe board
    [0, 3, 6],  // first vertical row of a tic tac toe board
    [1, 4, 7],  // second vertical row of a tic tac toe board
    [2, 5, 8],  // third vertical row of a tic tac toe board
    [0, 4, 8],  // upper left to lower right diagonal row of a tic tac toe board
    [2, 4, 6],  // upper right to lower left diagonal row of a tic tac toe board
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];      
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}