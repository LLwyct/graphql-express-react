import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Snipper from '../components/Snipper/Snipper';
import BookingList from '../components/BookingList/BookingList';

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
                            price
                        }
                        user {
                            email
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
        .then(data => {
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

    cancelBooking = (bookingId) => {
        this.setState({
            isLoading: true
        });
        const queryBody = {
            query: `
                    mutation {
                        cancelBooking(bookingId: "${bookingId}") {
                            _id
                        }
                    }
                `
        };

        fetch("http://localhost:3030/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.context.token
            },
            body: JSON.stringify(queryBody)
        })
        .then(response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("request failed!");
            }
            return response.json();
        })
        .then(() => {
            let idx = 0;
            for (let book of this.state.bookings) {
                if (book._id === bookingId) {
                    this.setState({
                        bookings: this.state.bookings.slice(0, idx).concat(this.state.bookings.slice(idx + 1))
                    })
                    break;
                }
                idx += 1;
            }
            this.setState({
                isLoading: false
            });
        })
    };

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h1>The booking Page</h1>
                    {
                        this.state.isLoading ? <Snipper /> : <BookingList bookings={this.state.bookings} cancelBooking={this.cancelBooking}></BookingList>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default BookingsPage;