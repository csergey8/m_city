import React from 'react'
import Featured from './featured/index';
import Matches from './matches/index'; 
import Meet from './meet/index';
import Promotion from './promotion/index';

 const Home = () => {
  return (
    <div className="bck_blue">
      <Featured />
      <Matches />
      <Meet />
      <Promotion />
    </div>
  )
}

export default Home;
