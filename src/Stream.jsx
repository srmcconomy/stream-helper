// @flow

import React, { Component } from 'react';
import store from './store';
import { TransformRecord, StreamRecord } from './Records';
import './Stream.css';
import dispatcher from './dispatcher';

type Props = {
  index: number,
}

type State = {
  stream: ?StreamRecord,
  transform: ?TransformRecord,
}

export default class Stream extends Component {

  props: Props;

  state: State;

  constructor(props: Props) {
    super(props);
    const data = store.get();
    const stream = data.streams.get(props.index);
    if (stream) {
      if (data.transforms.has(stream.name)) {
        this.state = {
          transform: data.transforms.get(stream.name),
          stream,
        };
      } else {
        this.state = {
          transform: new TransformRecord(),
          stream,
        };
      }
    } else {
      this.state = {
        stream: null,
        transform: null,
      }
    }
  }

  componentDidMount() {
    store.addChangeListener(this._onStoreChange);
  }

  componentWillUnmount() {
    store.removeChangeListener(this._onStoreChange);
  }

  _onStoreChange = (): void => {
    const data = store.get();
    const stream = data.streams.get(this.props.index);
    let transform = this.state.transform;
    if (stream && stream.name && data.transforms.has(stream.name)) {
      transform = data.transforms.get(stream.name);
    }
    if (!stream) {
      transform = null;
    } else if (!transform) {
      transform = new TransformRecord();
    }
    this.setState({ stream, transform });
  }

  render() {
    const { stream, transform } = this.state;
    if (stream && transform) {
      const { name, position, type, clip } = stream;
      const { left, top, scale, stretch } = transform;
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
    } else {
      return null;
    }
  }
}
