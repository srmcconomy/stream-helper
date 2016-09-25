// @flow

import React, { Component } from 'react';
import store from './store';
import { TransformRecord, StreamRecord } from './Records';
import './Stream.css';
import dispatcher from './dispatcher';

type Props = {
  name: string,
}

type State = {
  stream: StreamRecord,
  transform: TransformRecord,
}

export default class Stream extends Component {

  props: Props;

  state: State;

  constructor(props: Props) {
    super(props);
    const data = store.get();
    const stream = data.streams.find(
      value => value && value.name === this.props.name
    );
    if (stream) {
      if (data.transforms.has(props.name)) {
        this.state = {
          transform: data.transforms.get(props.name),
          stream,
        }
      } else {
        this.state = {
          transform: new TransformRecord(),
          stream,
        }
      }
    }
  }

  componentDidMount() {
    dispatcher.dispatch({
      type: 'set-transform',
      name: this.props.name,
      transform: this.state.transform,
    })
    store.addChangeListener(this._onStoreChange);
  }

  componentWillUnmount() {
    store.removeChangeListener(this._onStoreChange);
  }

  _onStoreChange = (): void => {
    const data = store.get();
    const stream = data.streams.find(
      value => value && value.name === this.props.name
    );
    let transform = this.state.transform;
    if (data.transforms.has(this.props.name)) {
      transform = data.transforms.get(this.props.name);
    }
    if (stream) {
      this.setState({ stream, transform });
    }
  }

  render() {
    const { name } = this.props;
    const {
      stream: { position, type, clip },
      transform: { left, top, scale, stretch }
    } = this.state;
    const multiplier = position === 'full' ? 2 : 1;
    const width = 80 * scale;
    const height = 45 * scale;
    let url;
    if (type === 'stream') {
      url = `http://player.twitch.tv/?muted=true&channel=${name}`;
    } else if (clip) {
      url = `https://clips.twitch.tv/embed?clip=${name}/${clip}&autoplay=0`;
    }
    let header = null;
    if (type === 'clip') {
      header = <div className="header">Instant Replay</div>;
    }
    return (
      <div className={`Stream ${position}`}>
        {header}
        <div className="name">{name}</div>
        <iframe
          src={url}
          style={{
            left: `${left * multiplier}vh`,
            top: `${top * multiplier}vh`,
            height: `calc(${height * multiplier}vh + 1px)`,
            width: `calc(${width * multiplier}vh + 1px)`,
            transform: `scaleX(${stretch})`,
          }}
        />
      </div>
    );
  }
}
