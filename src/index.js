import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick} >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    }
  }
  */
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
        squares: Array(9).fill(null)
      }],
      stepNumber:0,//用于标识现在显示的是第几步
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();//slice()方法返回一个从开始到结束选择的数组的一部分浅拷贝到一个新数组对象。原始数组不会被修改。
    if (calculateWinner(squares) || squares[i]) {//如果已经决出胜负了，且当前点击的square即squares[i]有值，那么就可以直接return了
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';//给当前点击的square即squares[i]赋值，如果下一步是'X'就给出值'X'，如果下一步是'O'就给出'O'
    this.setState({
      history: history.concat([{// Note:Array.prototype.concat(): 此方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
        //给state的history数组添加新的一项,即把当前最后一项的squares再添加一次到最后

        squares:squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0 //step为偶数时下一步为X
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);//计算赢家

    const moves= history.map((step,move) => {
      //NOTE：Array.prototype.map(function callback(currentValue, index))
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick = {() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status} </div>
          <ol>{moves} </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
}