import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


function Square(props) {
  //Square组件在使用时得带有属性onClick、value
  /**
   * @prop onClick， 从Board传递下来
   * @prop value，从Board传递下来
   */
  return (
    <button className="square" onClick={props.onClick} >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  /** Board组件在使用时得带有属性squares、onClick
   * @prop squares, TYPE ARRAY, 从Game传递下来
   * @prop onClick, TYPE Function， 从Game传递下来
   *                 * @param i
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
      }],//this.state.history：TYPE Array, 每项都是一个Object，且其具有属性squares。this.state.history.squares: TYPE Array,且有9项,初始每项都为null
      stepNumber:0,//用于标识现在显示的是第几步，初始为0
      xIsNext: true//用于标志下一步该走"X"还是该走"O"，初始就是下一步该走"X"
    };
  }

  handleClick(i) {
    /**
     * @dest: 传递给Board的onClick属性值函数
     * @param i: Board中点击的那个方框的序号
     */
    const history = this.state.history;
    const current = history[history.length - 1];//点击Board时当前的XO矩阵数据，即history的最后一项
    const squares = current.squares.slice();// current的一个拷贝。用于存储点击后的数据
    //NOTE:slice()方法返回一个从开始到结束选择的数组的一部分浅拷贝到一个新数组对象。原始数组不会被修改。
    if (calculateWinner(squares) || squares[i]) {//如果已经决出胜负了，或者当前点击的square即squares[i]有值，那么就可以直接return了
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';//给当前点击的square即squares[i]赋值，如果下一步是'X'就给出值'X'，如果下一步是'O'就给出'O'。这是由当前state中的xIsNext的值决定的。这样就更新了这个squares数组，即更新了对current（即history最后一项）的拷贝。
    this.setState({
      history: history.concat([{
        //给state的history数组添加新的一项,即把此处点击后得到的squares添加到history最后
        // Note:Array.prototype.concat(): 此方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
        squares:squares,
      }]),
      stepNumber: history.length,//步数为原history的长度
      xIsNext: !this.state.xIsNext //翻转当前state.xIsNext的值，true -> false / false -> true
    });
  }

  jumpTo(step) { 
    /** 
     * @dest 更新state中的stepNumber和xIsNext, 为点击这里生成的li时调用的函数。
     * @param step: 即this.state.history数组的index值
     */
    this.setState({
      stepNumber: step, //原为history的length，此时点到history的第几个就为，从0开始
      xIsNext: (step % 2) === 0 //step为偶数时下一步为X。此处因为是看历史记录，不能每点一下就翻转xIsNext的值，而应该根据点的是历史记录中的第几步来判断。
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);//计算赢家,得到值为'X'或'O'或null

    //得到历史记录li列表
    const moves= history.map((step,move) => {
      //NOTE：Array.prototype.map(function callback(currentValue, index))
      const desc = move ? 'Go to move #' + move : 'Go to game start';//如果move不为0则为'Go to nove #Num', 如果move为0则为'Go to game start'
      return (
        <li key={move}> 
          <button 
            onClick = {() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
      //NOTE:li的Key值一定要有
    });

    //得到历史记录列表上方的status提示语的div内容值
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
    );//onClick那边的i值有点难以理解
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