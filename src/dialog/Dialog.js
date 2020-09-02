import React, { Component } from 'react';
import "./Dialog.css";
import walls from "../assets/walls.gif"

let dialogStyles = {
    width: '500px',
    maxWidth: '100%',
    margin: '0 auto',
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '999',
    backgroundColor: '#eee',
    padding: '10px 20px 40px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
};

let dialogCloseButtonStyles = {
    marginBottom: '15px',
    backgroundColor: '#CBCBCB',
    padding: '3px 8px',
    cursor: 'pointer',
    borderRadius: '50%',
    border: 'none',
    width: '30px',
    height: '30px',
    fontWeight: 'bold',
    alignSelf: 'flex-end'
};

let center = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '300px'
}



class Dialog extends Component {
    state = {
        number: 1
    };

    closeModal() {
        this.setState({ number: 1 });
        this.props.onClose();
    }

    render() {
        console.log(this.state.number)
        let dialog = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={this.props.onClose}>x</button>
                <h1>Welcome to Pathfinding Visualizer!</h1>
                <br />
                <p className="subtitle">This tutorial will guide you through all of the features of this application.</p>
                <br />
                <p>if you want to skip, you can press "X" button to exit.</p>
                <button className="btn btn-primary" onClick={() => this.setState({ number: 2 })}>Next</button>
            </div >
        )

        let dialog2 = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={() => this.closeModal()}>x</button>
                <h1>Do you know what is a pathfinding algorithm?</h1>
                <br />
                <p className="subtitle">A pathfinding algorithm is used to find the shortest path between two points (start node and end node). This application visualize various pathfinding algorithms in action.</p>
                <br />
                <p>All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1.</p>
                <button className="btn btn-primary" onClick={() => this.setState({ number: 3 })}>Next</button>
            </div >
        )

        let dialog3 = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={() => this.closeModal()}>x</button>
                <h1>Adding walls</h1>
                <br />
                <p className="subtitle">Click on the grid to add a wall or click and drag to add walls</p>
                <br />
                <p>Walls are impenetrable, meaning that a path cannot cross through them.</p>
                <img style={center} src={walls} alt="walls" />
                <button className="btn btn-primary" onClick={() => this.setState({ number: 4 })}>Next</button>
            </div >
        )

        let dialog4 = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={() => this.closeModal()}>x</button>
                <h1>Dragging nodes</h1>
                <br />
                <p className="subtitle">Click and drag the start and end node to move them</p>
                <br />
                {/* <p>Walls are impenetrable, meaning that a path cannot cross through them.</p>
                <img style={center} src={walls} alt="walls" /> */}
                <button className="btn btn-primary" onClick={() => this.setState({ number: 5 })}>Next</button>
            </div >
        )

        let dialog5 = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={() => this.closeModal()}>x</button>
                <h1>Visualizing</h1>
                <br />
                <p className="subtitle">Click the buttons to visualize algorithm</p>
                <br />
                <p>You can clear the current path and clear walls from the navbar. If you want to access this tutorial again, click on "Pathfinding Visualizer" in the top left corner of your screen.</p>
                {/* <img style={center} src={walls} alt="walls" /> */}
                <button className="btn btn-primary" onClick={() => this.setState({ number: 6 })}>Next</button>
            </div >
        )

        let dialog6 = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={() => this.closeModal()}>x</button>
                <h1>Get to know the algorithms</h1>
                <br />
                <p className="subtitle">Not all algorithms are created equal.</p>
                <br />
                <p><strong>Dijkstra's Algorithm</strong>: the father of pathfinding algorithms; guarantees the shortest path</p>
                <p><strong>Breath-first Search</strong>: a great algorithm; guarantees the shortest path</p>
                <p><strong>Depth-first Search</strong>: a very bad algorithm for pathfinding; does not guarantee the shortest path</p>
                {/* <img style={center} src={walls} alt="walls" /> */}
                <button className="btn btn-primary" onClick={() => this.closeModal()}>Finish</button>
            </div >
        )


        if (!this.props.modalIsOpen) {
            dialog = null;
        }
        if (this.props.modalIsOpen && this.state.number === 1) {
            return (
                <div>
                    {dialog}
                </div>
            )
        } else if (this.props.modalIsOpen && this.state.number === 2) {
            return (
                <div>
                    {dialog2}
                </div>
            )
        } else if (this.props.modalIsOpen && this.state.number === 3) {
            return (
                <div>
                    {dialog3}
                </div>
            )
        } else if (this.props.modalIsOpen && this.state.number === 4) {
            return (
                <div>
                    {dialog4}
                </div>
            )
        } else if (this.props.modalIsOpen && this.state.number === 5) {
            return (
                <div>
                    {dialog5}
                </div>
            )
        } else if (this.props.modalIsOpen && this.state.number === 6) {
            return (
                <div>
                    {dialog6}
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}



export default Dialog;


