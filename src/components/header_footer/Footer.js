import React from 'react';
import { Logo } from '../ui/icons';

const Footer = () => {
  return (
    <footer className="bck_blue">
      <div className="footer_logo">
        <Logo
        width="75px"
        height="75px"
        link
        linkTo="/"
        />
      </div>
      <div className="footer_descl">
        Manchester city 2018.All rights reserved.
      </div>
    </footer>
  )
}

export default Footer;
 