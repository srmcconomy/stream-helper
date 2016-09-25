// @flow

import EventEmitter from 'events';
import { DataRecord } from './Records';
import dispatcher from './dispatcher';
import type { DispatchToken } from './dispatcher';


class Store extends EventEmitter {
  _data: DataRecord;
  _dispatchToken: DispatchToken;

  constructor() {
    super();
    this._data = new DataRecord();

    this._dispatchToken = dispatcher.register(payload => {
      const oldData = this._data;

      switch(payload.type) {
        case 'set-transform':
          this._data = this._data.setIn(
            ['transforms', payload.name],
            payload.transform
          );
          break;

        case 'set-stream': {
          let toIndex = this._data.streams.findIndex(
            stream => stream && stream.position === 'loading'
          );
          if (toIndex === -1) {
            toIndex = this._data.streams.findIndex(
              stream => stream === null
            );
          }
          this._data = this._data.setIn(
            ['streams', toIndex],
            payload.stream
          );
          break;
        }

        case 'move-stream': {
          const { from, to } = payload;
          const fromIndex = this._data.streams.findIndex(
            value => value && value.position === from
          );
          let toIndex = this._data.streams.findIndex(
            value => value && value.position === to
          );
          if (fromIndex > -1) {
            this._data = this._data.setIn(
              ['streams', fromIndex, 'position'],
              to
            );
          }
          if (toIndex > -1) {
            this._data = this._data.setIn(
              ['streams', toIndex],
              null
            );
          }
          break;
        }

        case 'select-stream':
          this._data = this._data.set('selectedStream', payload.name);
          break;

        case 'set-and-select-stream': {
          let toIndex = this._data.streams.findIndex(
            stream => stream && stream.position === 'loading'
          );
          if (toIndex === -1) {
            toIndex = this._data.streams.findIndex(
              stream => stream === null
            );
          }
          this._data = this._data.setIn(
            ['streams', toIndex],
            payload.stream
          ).set('selectedStream', payload.name);
          break;
        }

        case 'set-overlay':
          this._data = this._data.set('overlayOn', payload.value);
          break;

        default: break;
      }
      if (oldData !== this._data) {
        this.emitChange();
      }
    });
  }

  emitChange() {
    this.emit('change');
  }

  addChangeListener(callback: () => void) {
    this.on('change', callback);
  }

  removeChangeListener(callback: () => void) {
    this.removeListener('change', callback);
  }

  get() {
    return this._data;
  }
}

export default new Store();
