const { buildSchema } = require("graphql");


/**
 * 第一个！是指列表里的内容不能为null，就算为空也不能出现null
 * 第二个！是指必须要返回列表，即使是一个空列表，也不能返回null
 *
 * String的S要大写
 *
 * query是用于做查询的接口
 * mutation是用于做change的接口，change可以是增加、修改、删除
 *
 * events & createEvent 都属于resolver
 *
 */
module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updateAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createEvents: [Event!]
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
