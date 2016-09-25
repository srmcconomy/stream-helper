// @flow

import React, { Component } from 'react';
import store from './store';
import { TransformRecord } from './Records';
import type { TransformRecordProp } from './Records';
import dispatcher from './dispatcher';

type State = {
  name: ?string,
  transform: TransformRecord,
}

const steps : {[key: string]: number} = {
  left: 100/1080,
  top: 100/1080,
  scale: 1/400,
  stretch: 1/400,
};

export default class TransformTool extends Component {
  state: State;

  constructor() {
    super();
    const data = store.get();
    const name = data.selectedStream;
    if (name) {
      this.state = {
        name,
        transform: data.transforms.get(name),
      }
    } else {
      this.state = {
        name: '',
        transform: new TransformRecord(),
      }
    }
  }

  _onChange(prop: TransformRecordProp) {
    return (event: Event) => {
      const data = store.get();
      if (this.state.name && event.target instanceof HTMLInputElement) {
        const value = +event.target.value;
        dispatcher.dispatch({
          type: 'set-transform',
          name: this.state.name,
          transform: data.transforms.get(this.state.name).set(prop, +value),
        });
      }
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
    const name = data.selectedStream;
    if (name) {
      this.setState({
        name,
        transform: data.transforms.get(name),
      });
    }
  }

  render() {
    const { name, transform } = this.state;
    const inputs = [];
    if (transform) {
      transform.forEach((value, key) => {
        inputs.push(
          <div key={key}>
            {key}
            <input type="number" onChange={this._onChange(key)} step={steps[key]} value={value} />
          </div>
        );
      });
    }
    return (
      <div className="TransformTool">
        <div className="title">
          Transform {name}'s stream
        </div>
        <div>
          {inputs}
        </div>
      </div>
    );
  }
}
