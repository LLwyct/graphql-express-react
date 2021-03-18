const DataLoader = require('dataloader');
const Event = require("../../models/events");
const User = require("../../models/user");

const eventLoader = new DataLoader(eventIds => {
    return getEventsById(eventIds);
});

const userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds}});
})

const getEventsById = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        })
    } catch (error) {
        throw error;
    }
};

const getSingleEvent = async eventId => {
    try {
        return await eventLoader.load(eventId.toString());
    } catch (error) {
        throw error;
    }
}

const getUserById = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            password: null,
            createEvents: async () => await eventLoader.loadMany(user.createEvents)
        };
    } catch (error) {
        throw error;
    }
};

const transformEvent = event => {
    try {
        return {
            ...event._doc,
            date: event.date.toISOString(),
            creator: () => getUserById(event.creator)
        }
    }catch (err) {
        throw err;
    }
    
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: () => getUserById(booking.user),
        event: async () => getSingleEvent(booking.event),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
    }
};


exports.getUserById = getUserById;
exports.getEventsById = getEventsById;
exports.getSingleEvent = getSingleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
