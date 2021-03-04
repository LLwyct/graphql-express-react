const express = require("express");
const bodyParser = require("body-parser");
const {graphqlHTTP} = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

app.use(bodyParser.json());

const events = [];

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
            return events;
        },
        createEvent: (args) => {
            /**
             * 在jsinfo中学过，arguements参数是以类数组的方式呈现的，应该用索引获得，而不是kv形式，况且箭头函数是
             * 没有arguements参数的，这里应该是graphql内容对Schema中的函数参数用对象包裹了，这里才可以这么用。
             */
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}))
// app.get("/", (req, res, next) => {
//     res.send("hello world");
// })

app.listen(3000);