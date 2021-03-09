const Event = require("../../models/events");
const User = require("../../models/user");

const getUserById = userId => {
    return async function () {
        try {
            const user = await User.findById(userId);
            return {
                ...user._doc,
                password: null,
                createEvents: getEventsById(user.createEvents)
            };
        } catch (error) {
            throw error;
        }
    }
};

const getEventsById = eventIds => {
    return async function () {
        try {
            const events = await Event.find({ _id: { $in: eventIds } });
            return events.map(event => {
                return transformEvent(event);
            })
        } catch (error) {
            throw error;
        }
    }
};

const getSingleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (error) {
        throw error;
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        date: event.date.toISOString(),
        creator: getUserById(event.creator)
    }
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: getUserById(booking.user),
        event: getSingleEvent(booking.event),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
    }
};


exports.getUserById = getUserById;
exports.getEventsById = getEventsById;
exports.getSingleEvent = getSingleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
