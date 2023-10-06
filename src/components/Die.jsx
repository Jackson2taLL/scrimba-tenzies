import React from 'react';

const Die = (props) => {
  const styles = {
    backgroundColor: props.isHeld ? '#ffc0cb' : '#ffffff',
  };

  return (
    <div onClick={props.holdDie} className='die' style={styles}>
      <h2 className='die-num'>{props.playerSaved ? props.value : ''}</h2>
    </div>
  );
};

export default Die;
