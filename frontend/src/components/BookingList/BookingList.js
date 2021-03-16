import React from 'react';
const BookingList = ({bookings, cancelBooking}) => {
    if (bookings.length === 0) {
        return <h1 style={{textAlign: "center"}}>Empty</h1>
    }
    return (
        <ul className="eventList">
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
        </ul>
    )
};

const BookingItem = ({ booking, cancelBooking }) => {
    return (
        <li className="eventlist__item" key={booking._id}>
            <span>
                {booking.event.title} - {booking.createdAt}
            </span>
            <button onClick={cancelBooking.bind(null, booking._id)}>
                DELETE
            </button>
        </li>
    );
};

export default BookingList;