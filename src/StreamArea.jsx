// @flow

import React, { Component } from 'react';
import Stream from './Stream';
import Overlay from './Overlay';
import { List } from 'immutable';
import './StreamArea.css'

export default class StreamArea extends Component {

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
    return(
      <div className="StreamArea">
        {streams}
        <Overlay />
      </div>
    );
  }
}
