// @flow

import React, { Component } from 'react';
import StreamTool from './StreamTool';
import MoveTool from './MoveTool';
import TransformTool from './TransformTool';
import OverlayTool from './OverlayTool';
import ClipTool from './ClipTool';
import SRLTool from './SRLTool';
import './Toolbar.css';

export default class Toolbar extends Component {
  render() {
    return (
      <div className="Toolbar">
        <div className="title">
          Commentary Helper
        </div>
        <SRLTool />
        <StreamTool />
        <TransformTool />
        <MoveTool />
        <OverlayTool />
        <ClipTool />
      </div>
    );
  }
}
