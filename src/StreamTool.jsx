// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import './StreamTool.css';
import { StreamRecord } from './Records';
import dispatcher from './dispatcher';

type State = {
  streamNames: List<string>,
  filter: string,
}

const racers = [
  'amateseru',
  'Exodus',
  'SNIPING117',
  'tob3000',
  'alaris_villain',
  'Gombill',
  'blinkzy',
  'giuocob',
  'oxxyga',
  'DoctorKill',
  'Juwk',
  'Moose1137',
  'MikeKatz45',
  'matttinthehat',
  'Menou',
  'Xanra',
  'Tashman91',
  'aliensqueakytoy',
  'zebs',
  'flanthis',
  'Acermax',
  'blackbox64',
  'TwoDollarGargoyle',
  'moosecrap',
  'Ostrealava02',
  'PsyMarth',
];

export default class StreamTool extends Component {

  state: State;

  constructor() {
    super();
    this.state = { streamNames: List(racers.sort(function(a, b) {
      return a.toUpperCase() < b.toUpperCase() ? -1 : 1;
    })), filter: '' };
  }

  _handleFilterChange = (event: Event): void => {
    if (event.target instanceof HTMLInputElement)
      this.setState({ filter: event.target.value });
  }

  _handleButtonClick(name: string) {
    return () => {
      dispatcher.dispatch({
        type: 'set-and-select-stream',
        name,
        stream: new StreamRecord({
          name,
          type: 'stream',
          position: 'loading',
        })
      });
    }
  }

  render() {
    const { streamNames, filter } = this.state;
    const streams = streamNames.map(name => {
      const className = name.toUpperCase().includes(filter.toUpperCase()) ?
        '' : 'hidden';
      return (
        <button
          key={name}
          className={className}
          onClick={this._handleButtonClick(name)}>
          {name}
        </button>
      );
    })
    return (
      <div>
        <div>
          Choose a stream
        </div>
        <input
          placeholder="filter"
          onChange={this._handleFilterChange}
          value={filter}
        />
        <div>
          {streams}
        </div>
      </div>
    )
  }
}
