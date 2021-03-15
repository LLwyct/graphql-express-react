import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Snipper from '../components/Snipper/Snipper';

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: []
    }

    static contextType = AuthContext;

    componentDidMount () {
        this.fetchBookings();
    }

    fetchBookings = () => {
        if (!this.context.token) {
            return;
        }
        this.setState({
            isLoading: true
        });
        const queryBody = {
            query: `
                query {
                    bookings {
                        _id
                        event {
                            _id
                            title
                        }
                        user {
                            _id
                        }
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
        .then((response) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("request failed!");
            }
            return response.json();
        })
        .then((data) => {
            this.setState({
                bookings: data.data.bookings
            })
        })
        .catch((err) => {
            throw err;
        })
        .then(() => {
            this.setState({
                isLoading: false
            });
        }, err => {
            this.setState({
                isLoading: false
            });
            throw err;
        });
    };

    render() {
        return (
            <React.Fragment>
                <h1>The booking Page</h1>
                {
                    this.state.isLoading ? <Snipper /> :
                    <ul className="eventList">
                    {
                        this.state.bookings.map(booking => {
                            return <li className="eventlist__item" key={booking._id}>{booking.event.title} - {booking.createdAt}</li>
                        })
                    }
                    </ul>
                }
            </React.Fragment>
        );
    }
}

export default BookingsPage;