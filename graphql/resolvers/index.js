const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");


const rootValue = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver,
};

module.exports = rootValue;