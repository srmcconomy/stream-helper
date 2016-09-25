// @flow

import React, { Component } from 'react';
import Stream from './Stream';
import { List } from 'immutable';
import store from './store';
import type { StreamRecord } from './Records';

type State = {
  streamNames: List<?StreamRecord>,
}

export default class Streams extends Component {

  state: State;

  constructor() {
    super();
    this.state = { streamNames: List() };
  }

  _onStoreChange = () => {
    const data = store.get();
    this.setState({ streamNames: data.streams });
  }

  componentDidMount() {
    store.addChangeListener(this._onStoreChange);
  }

  componentWillUnmount() {
    store.removeChangeListener(this._onStoreChange);
  }

  render() {
    const { streamNames } = this.state;
    const streams = streamNames.map((stream) => {
      if (!stream) return null;
      return (
        <Stream
          key={`${stream.name}${stream.clip ? `/${stream.clip}`: ''}`}
          name={stream.name}
        />
      );
    }).toList();
    return(
      <div className="Streams">
        {streams}
      </div>
    );
  }
}
