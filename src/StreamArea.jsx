// @flow

import React, { Component } from 'react';
import Stream from './Stream';
import Overlay from './Overlay';
import { List } from 'immutable';
import './StreamArea.css'

const images = [
  'deku.jpg',
  'dc.jpg',
  'jabu.png',
  'forest.png',
  'fire.png',
  'water.png',
  'shadow.png',
  'spirit.png',
];

const IMAGE_DURATION = 60000;



export default class StreamArea extends Component {

  state: { imageIndex: number };
  _timeout: number;

  constructor() {
    super();
    this.state = { imageIndex: 0 };
  }

  componentDidMount() {
    this._timeout = setInterval(() => {
      const imageIndex = this.state.imageIndex === images.length - 1 ?
        0 : this.state.imageIndex + 1;
      this.setState({ imageIndex });
    }, IMAGE_DURATION);
  }

  render() {
    const streams = List().setSize(10).map((_, index) => {
      return (
        <Stream
          key={index}
          index={index}
          aspect={'a4-3'}
        />
      );
    });
    const image = images[this.state.imageIndex];
    return(
      <div
        className="StreamArea"
        style={{backgroundImage: `url(/images/${image})`}}>
        {streams}
        <Overlay />
      </div>
    );
  }
}
