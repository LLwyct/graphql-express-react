const express = require("express");
const bodyParser = require("body-parser");
const {graphqlHTTP} = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/events");

const app = express();

app.use(bodyParser.json());


app.use("/graphql", graphqlHTTP({
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
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    console.log(event);
                    return {
                        ...event._doc,
                        _id: event._doc._id.toString(),
                        date: event.date.toISOString()
                    };
                })
            }).catch(err => {
                throw err
            });
        },
        createEvent: args => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event
            .save()
            .then(result => {
                return {
                    ...result._doc,
                    _id: result.id
                }
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql: true
}))

/**
 * 现版本下必须加如下options才能启动成功。
 */
mongoose
.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ljtb5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("successed");
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
})
