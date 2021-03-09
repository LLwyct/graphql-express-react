const Event = require("../../models/events");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

const rootValue = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findById(args.eventId);
            const booking = new Booking({
                user: "604482754c6bd70d2453f3e0",
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

module.exports = rootValue;