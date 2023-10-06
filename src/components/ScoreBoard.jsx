import React from 'react';
import PlayerScore from './PlayerScore';

function ScoreBoard(props) {
  console.log('scoreboard in:', props.scoreBoard[0].playerName);
  return (
    <div>
      <h1>Score Board</h1>
      <div className='score-columns'>
        <p>Name</p>
        <p>Number Saved</p>
        <p>Total Score</p>
      </div>
      {props.scoreBoard[0].playerName ? (
        <div>
          {props.scoreBoard.map((score) => (
            <PlayerScore
              playerName={score.playerName}
              totalScore={score.totalScore}
              numberSaved={score.numberSaved}
            />
          ))}
        </div>
      ) : (
        <div>
          <h1> </h1>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;
