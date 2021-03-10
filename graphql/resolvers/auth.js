const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const rootValue = {
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
        } catch (error) {
            throw error;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error("User does not exist!");
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error("password is incorrect!");
            }
            const ONE_WEEK = 7 * 24 * 60 * 60;
            const token = jwt.sign({
                userId: user._id,
                email: user.email
            }, 
            "secret", {
                expiresIn: ONE_WEEK
            });

            return {
                _id: user.id,
                token: token,
                tokenExpiration: ONE_WEEK
            };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = rootValue;