const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createEvents: [
        {
            type: Schema.Types.ObjectId,
            // Event注意大小写
            ref: "Event"
        }
    ],
})

module.exports = mongoose.model("User", userSchema);