import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {stat} from 'fs';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            turn: {},
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });


      const status = squares.map(item => {
        switch (item) {
          case null:
            return "-";
            break;

          case "X":
            return "X";
            break;

          case "O":
            return "O";
            break;
        }
      });
      const statusString = status.join("");


        async function fetchData(i) {

            const res = await fetch(`https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/${statusString}/O`, {
                headers: {
                    "x-rapidapi-host": "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com",
                    "x-rapidapi-key": "7a3636db4dmsh4b6bc49efbd7bc3p147652jsn5a4c5e912d48"
                },
            });

            if (calculateWinner(squares) || squares[i]) {
                return;
            } else {
                res
                    .json()
                    .then(res => {
                        //console.log(res);
                        this.setState({
                            turn: res
                        })

                      if (this.xIsNext != true) {
                        squares[res.recommendation] = this.state.xIsNext ? "X" : "O";
                        this.setState({
                              squares: squares,
                              xIsNext: !this.state.xIsNext,
                            }
                        )
                      }
                    });

            }
        }

        fetchData.bind(this)();
    }


//const [turn, setTurn] = useState([]);

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}

            />
        );
    }

    newgame = () => {
        return this.setState({
            squares: Array(9).fill(null),
            xIsNext: true,
        });
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        console.log(this.state.turn)

        return (
            <div>
                <div className="status">{status}</div>
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
                <button type="button" onClick={this.newgame}>New Game</button>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
            return squares[a];
        }
    }
    return null;
}
