const Event = require("../../models/events");
const User = require("../../models/user");
const { transformEvent } = require("./merge");


const rootValue = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        try {
            let _event;
            const savedEvent = await event.save();
            _event = transformEvent(savedEvent);
            const user = await User.findById(savedEvent.creator);
            if (!user) {
                throw new Error("user do not existed");
            } else {
                // 这里理论上只需要一个Event id，但如果我们传递整个event进去，mongoose也能正确处理
                user.createEvents.push(event);
                await user.save();
            }
            return _event;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = rootValue;
exports.transformEvent = transformEvent;