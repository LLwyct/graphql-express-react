const bcrypt = require("bcryptjs");

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
}

const getEventsById = eventIds => {
    return async function () {
        try {
            const events = await Event.find({ _id: { $in: eventIds } });
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: getUserById(event.creator)
                }
            })
        } catch (error) {
            throw error;
        }
    }
}

const rootValue = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    date: event.date.toISOString(),
                    creator: getUserById(event.creator)
                };
            })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "604482754c6bd70d2453f3e0"
        })
        try {
            let _event;
            const savedEvent = await event.save();
            _event = {
                ...savedEvent._doc,
                creator: getUserById(savedEvent.creator)
            }
            const user = await User.findById(savedEvent.creator);
            if (!user) {
                throw new Error("user do not existed");
            } else {
                // 这里理论上只需要一个Event id，但如果我们传递整个event进去，mongoose也能正确处理
                user.createEvents.push(event);
                const user = await user.save();
            }
            return _event;
        } catch (error) {
            throw error;
        }
    },
    createUser: async args => {
        try {
            const user = User.findOne({ email: args.userInput.email })
            if (user) {
                throw new Error("user already existed");
            } else {
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                })
                const savedUser = await user.save();
                return {
                    ...savedUser._doc,
                    // 为了安全起见，这里返回null去代替password
                    password: null
                }
            }
        } catch(error) {
            throw error;
        }
    }
};

module.exports = rootValue;