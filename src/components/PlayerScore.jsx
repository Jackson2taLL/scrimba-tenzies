import React from 'react';

function PlayerScore(props) {
  return (
    <div className='scores'>
      <p>{props.playerName}</p>
      <p>{props.numberSaved}</p>
      <p>{props.totalScore}</p>
    </div>
  );
}

export default PlayerScore;
