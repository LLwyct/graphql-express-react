const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use( bodyParser.json() );

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Max-Age", "360000");
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

const graphQlSchema = require("./graphql/schema/index");
const graphQlRootValue = require("./graphql/resolvers/index");

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlRootValue,
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
    app.listen(3030);
})
.catch((err) => {
    console.log(err);
})
