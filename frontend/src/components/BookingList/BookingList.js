import React from 'react';
const BookingList = ({bookings, cancelBooking}) => {
    if (bookings.length === 0) {
        return <h1 style={{textAlign: "center"}}>Empty</h1>
    }
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">title</th>
                    <th scope="col">price - date</th>
                    <th scope="col">booker</th>
                    <th scope="col">opreation</th>
                </tr>
            </thead>
            <tbody>
                {
                    bookings.map(booking => {
                        return (
                            <BookingItem
                                booking={booking}
                                cancelBooking={cancelBooking}
                                key={booking._id}
                            />
                        );
                    })
                }
            </tbody>
        </table>
    )
};

const BookingItem = ({ booking, cancelBooking }) => {
    return (
        <tr>
            <td>{booking.event.title}</td>
            <td>{booking.event.price}$ - {booking.createdAt}</td>
            <td>{booking.user.email}</td>
            <td>
                <button onClick={() => cancelBooking(booking._id)} className="btn btn-danger">
                    DELETE
                </button>
            </td>
        </tr>
    );
};

export default BookingList;