const express = require("express");
const bodyParser = require("body-parser");
const {graphqlHTTP} = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/events");
const User = require("./models/user");

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

        type User {
            _id: ID!
            email: String!
            password: String
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
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
                date: new Date(args.eventInput.date),
                creator: "60434731671d8120f059f127"
            })
            let _event;
            return event.save()
            .then(result => {
                // 这里这么做的原因是底下返回的result是user.save()的结果，是user的_doc，而本函数原始的目的是返回event创建的结果，因此要特殊处理
                _event = {
                    ...result._doc,
                    id: result.id
                }
                console.log(result);
                return User.findById(result.creator);
            })
            .then(user => {
                if (!user) {
                    throw new Error("user do not existed");
                } else {
                    console.log(user);
                    // 这里理论上只需要一个Event id，但如果我们传递整个event进去，mongoose也能正确处理
                    user.createEvents.push(event);
                    return user.save();
                }
            })
            .then(result => {
                return _event;
            })
            .catch(err => {
                throw err;
            });
        },
        createUser: args => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    // 不论user存在与否，都会fulfilled并返回user
                    // 除非，发生网络错误，数据库连接错误等，才会rejected
                    if (user) {
                        throw new Error("user already existed");
                    } else {
                        return bcrypt.hash(args.userInput.password, 12);
                    }
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword,
                    })
                    return user.save();
                })
                .then(result => {
                    return {
                        ...result._doc,
                        _id: result.id,
                        // 为了安全起见，这里返回null去代替password
                        password: null
                    }
                })
                .catch(err => {
                    throw err;
                })
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
