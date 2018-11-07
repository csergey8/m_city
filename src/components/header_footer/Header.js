import React, { Component } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';

import { Logo } from '../ui/icons';

import { Link } from 'react-router-dom';

export default class Header extends Component {
  render() {
    return (
      <AppBar
        position="fixed"
        style={{
          backgroundColor: '#98c5e9',
          boxShadow: 'none',
          padding: '10px 0',
          borderBottom: '2px solid #00285e'
        }}
      >
        <Toolbar style={{ display: 'flex' }}>
          <div style={{ flexGrow: '1' }}>
            <div className="header_logo">
              <Logo link linkTo='/' width="75px" height="75px" />
            </div>
          </div>
            <Link to="/the_team">
              <Button color="inherit">The team</Button>
            </Link>
            <Link to="/the_matches">
              <Button color="inherit">Matches</Button>
            </Link>
        </Toolbar>
      </AppBar>
    )
  }
}
