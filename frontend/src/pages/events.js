import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Dropback from '../components/Dropback/Dropback';

class EventsPage extends Component {
    state = {
        isModalShow: false
    }
    modalStateSwitchHandler = () => {
        this.setState({
            isModalShow: true
        })
    };

    onCancel = () => {
        this.setState({
            isModalShow: false
        })
    };

    onConfirm = () => {
        this.setState({
            isModalShow: false
        })
        return;
    };

    render() {
        return (
            <React.Fragment>
                <div>
                    <h1>The events Page</h1>
                    <button onClick={this.modalStateSwitchHandler}>Add Event</button>
                </div>
                {this.state.isModalShow && <Dropback />}
                {this.state.isModalShow && <Modal
                    title="Add an event" 
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}
                >
                    <form action="">
                        <input type="text"/>
                        <input type="text"/>
                    </form>
                </Modal>}
            </React.Fragment>
        );
    }
}

export default EventsPage;