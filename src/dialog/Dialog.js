import React, { Component } from 'react';

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
                <div>{this.props.children}</div>
                <button className="btn btn-primary" onClick={() => this.setState({ number: 2 })}>Next</button>
            </div>
        )

        let dialog2 = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={() => this.closeModal()}>x</button>
                <div>123</div>
                <button className="btn btn-primary" onClick={this.props.onClose}>Next</button>
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
        } else {
            return (<div></div>)
        }
    }
}



export default Dialog;


