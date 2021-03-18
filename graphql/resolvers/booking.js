const Event = require("../../models/events");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

const rootValue = {
    bookings: async (_, req) => {
        if (!req.isAuth) {
            throw new Error("un authenticated!");
        }
        try {
            const bookings = await Booking.find({
                user: req.userId
            });
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("un authenticated!");
        }
        try {
            const fetchedEvent = await Event.findById(args.eventId);
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("un authenticated!");
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = rootValue;