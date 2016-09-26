// @flow

import React, { Component } from 'react';
import store from './store';
import dispatcher from './dispatcher';
import './MoveTool.css';

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
      });
    };
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
    const text = this.state.name ?
      `Move ${this.state.name}'s stream` :
      'Remove Stream';
    return (
      <div className="MoveTool">
        <div className="title">
          {text}
        </div>
        <div className="button-area">
          <button className="one" onClick={this._onClick('one')} />
          <button className="two" onClick={this._onClick('two')} />
          <button className="three" onClick={this._onClick('three')} />
          <button className="full" onClick={this._onClick('full')} />
        </div>
      </div>
    );
  }
}
