import React, { useState, useEffect } from 'react';
import Die from './components/Die.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';
import { nanoid } from 'nanoid';

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [currentScore, setCurrentScore] = useState(0);
  const [tenzies, setTenzies] = useState(false);
  const [firstClick, setFirstClick] = useState(0);
  const [player, setPlayer] = useState({ name: '', saved: false });
  const [scoreBoard, setScoreBoard] = useState(
    () => JSON.parse(localStorage.getItem('scores')) || []
  );

  const sortedScores = scoreBoard.sort((a, b) => a.totalScore - b.totalScore);

  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scoreBoard));
  }, [scoreBoard]);

  useEffect(() => {
    let dupe = 0;
    for (let i = 0; i < dice.length; i++) {
      if (dice[i].isHeld) {
        dupe += 1;
      }
    }
    dupe === 0 && setFirstClick(0);
    dupe === 10 ? setTenzies(true) : setTenzies(false);
  }, [dice]);

  useEffect(() => {
    if (tenzies) {
      if (scoreBoard.length < 10) {
        setScoreBoard((prevScoreBoard) =>
          // check if the current score is lower than the last place score on the scoreboard array
          // if it is, reassign the last score as the current score
          // then sort
          [
            ...prevScoreBoard,
            {
              playerName: player.name,
              totalScore: currentScore,
              numberSaved: firstClick,
              id: nanoid(),
            },
          ]
        );
      } else if (scoreBoard[scoreBoard.length - 1].totalScore > currentScore) {
        setScoreBoard((prevScoreBoard) =>
          prevScoreBoard.map((prevScore) => {
            if (prevScore.id === prevScoreBoard[prevScoreBoard.length - 1].id) {
              return {
                playerName: player.name,
                totalScore: currentScore,
                numberSaved: firstClick,
                id: nanoid(),
              };
            } else {
              return prevScore;
            }
          })
        );
      }
    }
  }, [tenzies]);

  function allNewDice() {
    const numArr = [];
    for (let i = 0; i < 10; i++) {
      numArr.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      });
    }
    return numArr;
  }

  function reroll() {
    if (!tenzies) {
      setCurrentScore((prevScore) => prevScore + 1);
      setDice((prevDice) =>
        prevDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setPlayer({ name: '', saved: false });
      setCurrentScore(0);
      setFirstClick(0);
      setDice(allNewDice());
    }
  }

  function holdDie(myDie) {
    if (player.saved && (firstClick === 0 || firstClick === myDie.value)) {
      setFirstClick(myDie.value);
      setDice((prevDice) =>
        prevDice.map((die) =>
          die.id === myDie.id ? { ...die, isHeld: !die.isHeld } : die
        )
      );
    }
  }

  function saveName(e) {
    const { value } = e.target;
    if (value.length < 11) {
      setPlayer((prevPlayer) => ({ ...prevPlayer, name: value }));
    }
    e.preventDefault();
  }

  function startGame(e) {
    player.name
      ? setPlayer((prevPlayer) => ({ ...prevPlayer, saved: true }))
      : alert('input name');
    e.preventDefault();
  }

  // async function newScore() {}

  return (
    <div>
      <h1 className='title'>Tenzies</h1>
      <main className='main'>
        <p className='instructions'>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className='dice'>
          {dice.map((die) => (
            <Die
              isHeld={die.isHeld}
              value={die.value}
              key={die.id}
              holdDie={() => holdDie(die)}
              playerSaved={player.saved}
            />
          ))}
        </div>
        <div>
          {!player.saved ? (
            <form>
              <input
                type='text'
                placeholder='Enter Name'
                id='enterName'
                className='player-input'
                value={player.name}
                name='topText'
                onChange={saveName}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlurCapture={(e) => (e.target.placeholder = 'Enter Name')}
              ></input>
              <button onClick={startGame} className='save-name-button'>
                Start Game
              </button>
            </form>
          ) : (
            <div>
              <button onClick={() => reroll()} className='roll-dice'>
                {tenzies ? 'Play Again?' : 'Roll'}
              </button>
              <div className='current-score'>
                <h4>{tenzies ? 'Final ' : ''}Score</h4>
                <h3>{currentScore}</h3>
              </div>
            </div>
          )}
        </div>
      </main>
      <br />
      {scoreBoard[0] && tenzies && (
        <div className='scoreboard'>
          <ScoreBoard scoreBoard={sortedScores} />
        </div>
      )}
    </div>
  );
}

export default App;

//keep the screen size the same when changing to a smaller size
// add a timer feature that multiplies with the score to provide a final score
