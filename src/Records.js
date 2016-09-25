// @noflow

import { Record, Map, List } from 'immutable';

export const TransformRecord = Record({
  top: 0,
  left: 0,
  scale: 1,
  stretch: 1,
});

export const StreamRecord = Record({
  name: '',
  type: '',
  clip: '',
  position: '',
});

export const DataRecord = Record({
  streams: new List([null, null, null, null, null]),
  transforms: new Map(),
  selectedStream: null,
  overlayOn: true,
});
