// @flow

import React, { Component } from 'react';
import Stream from './Stream';

export default class Streams extends Component {

  render() {
    const streams = [0, 1, 2, 3, 4].map(index => {
      return (
        <Stream
          key={index}
          index={index}
        />
      );
    });
    return(
      <div className="Streams">
        {streams}
      </div>
    );
  }
}
