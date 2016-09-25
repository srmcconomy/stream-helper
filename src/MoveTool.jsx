// @flow

import React, { Component } from 'react';
import store from './store';
import dispatcher from './dispatcher';


type State = {
  name: ?string,
};

export default class MoveTool extends Component {

  state: State;

  constructor() {
    super();
    const data = store.get();
    const stream = data.streams.find(stream => stream && stream.position === 'loading');
    if (stream) {
      this.state = { name: stream.name };
    } else {
      this.state = { name: null };
    }
  }

  _onClick(position: string) {
    return () => {
      dispatcher.dispatch({
        type: 'move-stream',
        from: 'loading',
        to: position,
      })
    }
  }

  componentDidMount() {
    store.addChangeListener(this._onStoreChange);
  }

  componentWillUnmount() {
    store.removeChangeListener(this._onStoreChange);
  }

  _onStoreChange = () => {
    const data = store.get();
    const stream = data.streams.find(
      stream => stream && stream.position === 'loading'
    );
    if (stream) {
      this.setState({ name: stream.name });
    }
  }

  render() {
    return (
      <div className="MoveTool">
        <div className="title">
          Move {this.state.name}'s stream
        </div>
        <div>
          <button onClick={this._onClick('one')} />
          <button onClick={this._onClick('two')} />
          <button onClick={this._onClick('three')} />
          <button onClick={this._onClick('full')} />
        </div>
      </div>
    );
  }
}
