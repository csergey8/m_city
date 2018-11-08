import React from 'react';
import { Link } from 'react-router-dom';


export const Tag = (props) => {
  const template = <div
      style={{
        background: props.bck,
        fontSize: props.size,
        color: props.color,
        padding: '5px',
        display: 'inline-block',
        fontFamily: 'Righteous',
        ...props.add
      }}>{props.children}</div>;

  return props.link ? (
            <Link to={props.link}>
              {template}
            </Link>
            ) : template

  /*
  if(props.link) {
    return (
      <Link to={props.link}>
        {template}
      </Link>
    )
  } else {
    return template
  }
*/
}

export const firebaseLooper = (snapshot) => {
  const data = [];
  
  snapshot.forEach((childSnapshot) => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key
    })
  })

  return data
}


export const reverseArray = (array) => {
  const reversedArray = [];

  for(let i = array.length - 1; i >= 0; i--) {
    reversedArray.push(array[i]);
  }

  return reversedArray
}


export const PlayerCard = ({ number, name, lastname, bck}) => {
  return (
    <div className="player_card_wrapper">
      <div className="player_card_thmb" 
      style={{
        background: `#f2f9ff url(${bck})`
      }}></div>
      <div className="player_card_nfo">
        <div className="player_card_number">
        {number}
        </div>
        <div className="player_card_name">
          <span>{name}</span>
          <span>{lastname}</span>
        </div>
      </div>
    </div>
  );
}
