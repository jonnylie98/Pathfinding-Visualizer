import React, { Component } from "react";

import "./Node.css";

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
      col,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
        ? "node-start"
        : isWall
          ? "node-wall"
          : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
      ></div>
    );
  }
}

export default Node;
