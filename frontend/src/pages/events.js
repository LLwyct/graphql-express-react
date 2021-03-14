import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Dropback from '../components/Dropback/Dropback';
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
    state = {
        isModalShow: false,
        events: []
    }

    static contextType = AuthContext;

    constructor (props) {
        super(props);
        this.titleElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount () {
        this.fetchEvents();
    }
    modalStateSwitchHandler = () => {
        this.setState({
            isModalShow: true,
        })
    };

    onCancel = () => {
        this.setState({
            isModalShow: false
        })
    };

    onConfirm = () => {
        const title = this.titleElRef.current.value;
        const date = this.dateElRef.current.value;
        const price = this.priceElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const queryBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
        const token = this.context.token;
        fetch("http://localhost:3030/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(queryBody),
        })
        .then(response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("request failed!")
            }
            this.setState({
                isModalShow: false
            })
            return response.json();
        })
        .then(data => {
            let newEvents = this.state.events;
            this.setState({
                events: newEvents.concat([data.data.createEvent])
            })
        })
        .catch(err => {
            throw err;
        }) ;
    };
    /**
     * fetch all events
     */
    fetchEvents () {
        const queryBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        price
                        date
                        description
                    }
                }
            `
        }
        fetch("http://localhost:3030/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(queryBody),
        })
            .then((response) => {
                if (response.status !== 200 && response.status !== 201) {
                    throw new Error("request failed!");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    events: data.data.events
                })
            })
            .catch((err) => {
                throw err;
            });
    }
    render() {
        const eventsList = this.state.events.map(event => {
            return <li className="eventlist__item" key={event._id}>{event.title}</li>
        });
        return (
            <React.Fragment>
                {this.state.isModalShow && <Dropback />}
                {this.state.isModalShow && <Modal
                    title="Add an event" 
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="descrip">Description</label>
                            <textarea id="descrip" rows="4" ref={this.descriptionElRef} >
                            </textarea>
                        </div>
                    </form>
                </Modal>}
                <div>
                    <h1>The events Page</h1>
                    {this.context.token && <button onClick={this.modalStateSwitchHandler}>Add Event</button>}
                </div>
                <div>
                    <ul className="eventlist">{eventsList}</ul>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;