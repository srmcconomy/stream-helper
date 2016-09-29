// @flow

import React, { Component } from 'react';
import store from './store';
import dispatcher from './dispatcher';
import type { Aspect } from './Records';

export default class AspectTool extends Component {

  _onClick(aspect: Aspect) {
    return () => {
      dispatcher.dispatch({
        type: 'set-aspect',
        aspect,
      })
    }
  }

  render() {
    return (
      <div className="AspectTool">
        <div className="title">Set aspect ratio</div>
        <div className="buttons">
          <button
            className="a4-3"
            onClick={this._onClick('a4-3')}>
            4:3
          </button>
          <button
            className="a16-9"
            onClick={this._onClick('a16-9')}>
            16:9
          </button>
        </div>
      </div>
    );
  }
}
