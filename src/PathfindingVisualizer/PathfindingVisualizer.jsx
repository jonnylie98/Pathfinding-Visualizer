import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { astar } from "../algorithms/astar";
import { randomMaze } from "../maze-algorithms/randomMaze";
import Dialog from "../dialog/Dialog";

import "./PathfindingVisualizer.css";

class PathfindingVisualizer extends Component {
  state = {
    grid: [],
    mouseIsPressed: false,
    isRunning: false,
    isStartNode: false,
    isFinishNode: false,
    isWalNode: false,
    currRow: 0,
    currCol: 0,
    START_NODE_ROW: 10,
    START_NODE_COL: 10,
    FINISH_NODE_ROW: 10,
    FINISH_NODE_COL: 30,
    startNode_Pos: [],
    finishNode_Pos: [],
    previousNode: false,
    modalIsOpen: true,
  };

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  isRunning() {
    this.setState({ isRunning: !this.state.isRunning });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 40; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (col, row) => {
    return {
      col,
      row,
      isStart:
        row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
      isFinish:
        row === this.state.FINISH_NODE_ROW &&
        col === this.state.FINISH_NODE_COL,
      distance: Infinity,
      distanceToFinishNode:
        Math.abs(this.state.FINISH_NODE_ROW - row) +
        Math.abs(this.state.FINISH_NODE_COL - col),
      isVisisted: false,
      isWallNode: false,
      previousNode: null,
    };
  };

  clearWalls() {
    if (!this.state.isRunning && !this.state.modalIsOpen) {
      const newGrid = this.state.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (nodeClassName === "node node-wall") {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isWall = false;
          }
        }
      }
    }
  }

  clearPaths() {
    if (!this.state.isRunning && !this.state.modalIsOpen) {
      const newGrid = this.state.grid.slice();
      for (const row of newGrid) {
        for (const node of row) {
          let nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish" &&
            nodeClassName !== "node node-wall"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(this.state.FINISH_NODE_ROW - node.row) +
              Math.abs(this.state.FINISH_NODE_COL - node.col);
          }
          if (nodeClassName === "node node-finish") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode = 0;
          }
          if (nodeClassName === "node node-start") {
            node.isVisited = false;
            node.distance = Infinity;
            node.distanceToFinishNode =
              Math.abs(this.state.FINISH_NODE_ROW - node.row) +
              Math.abs(this.state.FINISH_NODE_COL - node.col);
            node.isStart = true;
            node.isWall = false;
            node.previousNode = null;
            node.isNode = true;
          }
        }
      }
    }
  }

  handleMouseDown(row, col) {
    this.clearPaths();
    if (!this.state.isRunning && !this.state.modalIsOpen) {
      if (
        document.getElementById(`node-${row}-${col}`).className ===
        "node node-start"
      ) {
        this.setState({
          mouseIsPressed: true,
          isStartNode: true,
          currRow: row,
          currCol: col,
        });
      } else if (
        document.getElementById(`node-${row}-${col}`).className ===
        "node node-finish"
      ) {
        this.setState({
          mouseIsPressed: true,
          isFinishNode: true,
          currRow: row,
          currCol: col,
        });
      } else {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({
          grid: newGrid,
          mouseIsPressed: true,
          isWallNode: true,
          currRow: row,
          currCol: col,
        });
      }
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.isRunning && !this.state.modalIsOpen) {
      if (this.state.mouseIsPressed) {
        const nodeClassName = document.getElementById(`node-${row}-${col}`)
          .className;
        if (this.state.isStartNode) {
          if (nodeClassName !== "node node-wall") {
            const prevStartNode = this.state.grid[this.state.currRow][
              this.state.currCol
            ];
            prevStartNode.isStart = false;
            document.getElementById(
              `node-${this.state.currRow}-${this.state.currCol}`
            ).className = "node";
            this.setState({ currRow: row, currCol: col });
            const currStartNode = this.state.grid[row][col];
            currStartNode.isStart = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node node-start";
          }
          this.setState({ START_NODE_ROW: row, START_NODE_COL: col });
        } else if (this.state.isFinishNode) {
          if (nodeClassName !== "node node-wall") {
            const prevFinishNode = this.state.grid[this.state.currRow][
              this.state.currCol
            ];
            prevFinishNode.isFinish = false;
            document.getElementById(
              `node-${this.state.currRow}-${this.state.currCol}`
            ).className = "node";
            this.setState({ currRow: row, currCol: col });
            const currFinishNode = this.state.grid[row][col];
            currFinishNode.isFinish = true;
            document.getElementById(`node-${row}-${col}`).className =
              "node node-finish";
          }
          this.setState({ FINISH_NODE_ROW: row, FINISH_NODE_COL: col });
        } else if (this.state.isWallNode) {
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ grid: newGrid });
        }
      }
    }
  }

  handleMouseUp(row, col) {
    if (!this.state.isRunning && !this.state.modalIsOpen) {
      this.setState({ mouseIsPressed: false });
      if (this.state.isStartNode) {
        const isStartNode = !this.state.isStartNode;
        this.setState({
          isStartNode,
          START_NODE_ROW: row,
          START_NODE_COL: col,
        });
      } else if (this.state.isFinishNode) {
        const isFinishNode = !this.state.isFinishNode;
        this.setState({
          isFinishNode,
          FINISH_NODE_ROW: row,
          FINISH_NODE_COL: col,
        });
      }
    }
  }

  handleMouseLeave() {
    if (this.state.isStartNode) {
      const isStartNode = !this.state.isStartNode;
      this.setState({ isStartNode, mouseIsPressed: false });
    } else if (this.state.isFinishNode) {
      const isFinishNode = !this.state.isFinishNode;
      this.setState({ isFinishNode, mouseIsPressed: false });
    } else if (this.state.isWallNode) {
      const isWallNode = !this.state.isWallNode;
      this.setState({ isWallNode, mouseIsPressed: false });
      this.getInitialGrid();
    }
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName !== "node node-start" &&
          nodeClassName !== "node node-finish"
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (nodesInShortestPathOrder[i] === "last") {
        setTimeout(() => {
          this.isRunning();
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`
          ).className;
          if (
            nodeClassName !== "node node-start" &&
            nodeClassName !== "node node-finish"
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
        }, 50 * i);
      }
    }
  }

  visualizeAlgorithm(algorithm) {
    if (!this.state.isRunning && !this.state.modalIsOpen) {
      this.isRunning();
      const { grid } = this.state;
      let visitedNodesInOrder;
      const startNode =
        grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
      const finishNode =
        grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
      switch (algorithm) {
        case "Dijkstra":
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
        case "Breadth-first Search":
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case "Depth-first Search":
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        case "A*":
          visitedNodesInOrder = astar(grid, startNode, finishNode);
          break;
        default:
          break;
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      nodesInShortestPathOrder.push("last");
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

  /*----------------------------------------------------------maze generations functions---------------------------------------------------------*/
  generateRandomMaze = () => {
    if (this.state.isRunning) return;
    this.setState({ isRunning: true });
    const {
      grid,
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL,
    } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    console.log(startNode);
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const walls = randomMaze(grid, startNode, finishNode);
    this.animateWalls(walls, grid);
  };

  animateWalls = (walls, grid) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          const newGrid = getNewGridWithMaze(this.state.grid, walls);
          this.setState({ grid: newGrid, isRunning: false });
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const wall = walls[i];
        const node = grid[wall[0]][wall[1]];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-animated-wall";
      }, 10 * i);
    }
  };

  /*------------------------------------------------------------------------------------------------------------------------------*/

  render() {
    const { grid, mouseIsPressed } = this.state;
    // console.log(grid);

    return (
      <>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button
              className="title"
              onClick={(e) => this.setState({ modalIsOpen: true })}
            >
              Pathfinding Visualizer
            </button>
          </nav>
          <div className="action">
            <Dialog
              modalIsOpen={this.state.modalIsOpen}
              onClose={() => this.setState({ modalIsOpen: false })}
            ></Dialog>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.clearPaths();
                this.visualizeAlgorithm("Dijkstra");
              }}
            >
              Dijkstra's Algorithm
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.clearPaths();
                this.visualizeAlgorithm("Depth-first Search");
              }}
            >
              Depth-first Search
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.clearPaths();
                this.visualizeAlgorithm("A*");
              }}
            >
              A* Search
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.clearPaths();
                this.visualizeAlgorithm("Breadth-first Search");
              }}
            >
              Breadth-first Search
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                this.clearPaths();
                this.clearWalls();
                this.generateRandomMaze();
              }}
            >
              Generate Random Maze
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.clearWalls()}
            >
              Clear Walls
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.clearPaths()}
            >
              Clear Paths
            </button>
          </div>
          <div
            className="grid-container"
            onMouseLeave={() => this.handleMouseLeave()}
          >
            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {
                        row,
                        col,
                        isStart,
                        isFinish,
                        isVisisted,
                        isWall,
                      } = node;
                      return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          row={row}
                          isStart={isStart}
                          isFinish={isFinish}
                          isVisisted={isVisisted}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) =>
                            this.handleMouseDown(row, col)
                          }
                          onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                          }
                          onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                        ></Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="info">
            <div className="block" id="yellow" />
            <span className="explanation">: Path Node</span>
            <div className="block" id="blue" />
            <span className="explanation">: Visited Node</span>
            <div className="block" id="start-node" />
            <span className="explanation">: Start Node</span>
            <div className="block" id="finish-node" />
            <span className="explanation">: Finish Node</span>
          </div>
        </div>
      </>
    );
  }
}

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
};

export default PathfindingVisualizer;
