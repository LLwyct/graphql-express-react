import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Dropback from '../components/Dropback/Dropback';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Snipper from '../components/Snipper/Snipper';

class EventsPage extends Component {
    state = {
        isModalShow: false,
        isLoading: false,
        events: [],
        selectedEvent: null
    };

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
            isModalShow: false,
            selectedEvent: null
        })
    };
    bookEventHandler = () => {
        if (!this.context.token) {
            this.setState({selectedEvent: null});
            return;
        }
        const queryBody = {
            query: `
                mutation {
                    bookEvent(eventId: "${this.state.selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `
        }
        fetch("http://localhost:3030/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.context.token
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
            console.log(data.data);
            this.setState({selectedEvent: null});
        })
        .catch(err => {
            throw err;
        });
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
        fetch("http://localhost:3030/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.context.token
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
        });
    };
    /**
     * fetch all events
     */
    fetchEvents () {
        this.setState({
            isLoading: true
        });
        const queryBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            _id
                            createEvents {
                                title
                            }
                        }
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
        })
        .then(() => {
            this.setState({
                isLoading: false
            });
        },err => {
            this.setState({
                isLoading: false
            });
            throw err;
        });
    }

    showDetailHandler = (eventId) => {
        this.setState(prevState => {
            const event = prevState.events.find(event => event._id === eventId);
            return {
                selectedEvent: event
            }
        })
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    {(this.state.isModalShow || this.state.selectedEvent) && <Dropback />}
                {this.state.isModalShow && <Modal
                    title="Add an event" 
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}
                    secondBtnText="Confirm"
                >
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef} className="form-control"/>
                        </div>
                            <div className="form-group">
                            <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElRef} className="form-control"/>
                        </div>
                            <div className="form-group">
                            <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElRef} className="form-control"/>
                        </div>
                            <div className="form-group">
                            <label htmlFor="descrip">Description</label>
                                <textarea id="descrip" rows="4" ref={this.descriptionElRef} className="form-control">
                            </textarea>
                        </div>
                    </form>
                </Modal>}
                {this.state.selectedEvent && <Modal
                    title="Event Detail"
                    onCancel={this.onCancel}
                    onConfirm={this.bookEventHandler}
                    secondBtnText={this.context.token ? "Book" : "Confirm"}
                >
                    <h1>{this.state.selectedEvent.title}</h1>
                    <p className="text--highlight">
                        price: {this.state.selectedEvent.price}$ - {new Date(this.state.selectedEvent.date).toLocaleString()}
                    </p>
                    <p>
                        {this.state.selectedEvent.description}
                    </p>
                </Modal>}
                <div>
                    <h1>The events Page</h1>
                </div>
                <div className="m-4" style={{textAlign: "center"}}>
                    {this.context.token && <button onClick={this.modalStateSwitchHandler} className="btn btn-primary">Add Event</button>}
                </div>
                {
                    this.state.isLoading ? <Snipper /> 
                    : <div>
                        <EventList events={this.state.events} showDetail={this.showDetailHandler}/>
                    </div>
                }
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;