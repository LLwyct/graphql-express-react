const bcrypt = require("bcryptjs");
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
    }
};

module.exports = rootValue;