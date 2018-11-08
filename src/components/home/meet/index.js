import React, { Component } from 'react';
import stripes from '../../../Resources/images/stripes.png';
import { Tag } from '../../ui/misc';
import { Reveal } from 'react-reveal';
import HomeCards from './cards';

export default class Meet extends Component {

  state = {
    show: false
  }

  render() {
    return (
      <Reveal
        fraction={0.7}
        onReveal={() => {
          this.setState({ show: true })
        }}
      >
        <div className="home_meetplayers" style={{ background: `#ffffff url(${stripes})` }}>
          <div className="container">
              <div className="home_meetplayers_wrapper">
                <div className="home_card_wrapper">
                  <HomeCards
                  show={this.state.show}
                  />
                </div>
                <div className="home_text_wrapper">
                  <div>
                    <Tag bck="#0e1731"
                      size="100px"
                      color="#ffffff"
                      add={{
                        display: 'inline-block',
                        marginBottom: '10px' 
                      }} 
                    >
                      Meet
                    </Tag>
                  </div>
                </div>
                  <div className="home_text_wrapper">
                  <div>
                    <Tag
                      bck="#0e1731"
                      size="100px"
                      color="#ffffff"
                      add={{
                        display: 'inline-block',
                        marginBottom: '10px' 
                      }}
                    >
                      The
                    </Tag>
                  </div>
                  </div>
                  <div className="home_text_wrapper">
                    <div>
                      <Tag
                        bck="#0e1731"
                        size="100px"
                        color="#ffffff"
                        add={{
                          display: 'inline-block',
                          marginBottom: '10px' 
                        }}
                      >
                        Players
                      </Tag>
                    </div>
                    <div>
                        <Tag
                        bck="#ffffff"
                        size="27px"
                        color="#0e1731"
                        link="/the_team"
                        add={{
                          display: 'inline-block',
                          marginBottom: '27px',
                          border: '1px solid #0e1731'
                        }}
                        >
                          Meet them here
                        </Tag>
                    </div>
                </div> 
                </div> 
              </div>
            </div> 
          </Reveal>
    )
  }
}
