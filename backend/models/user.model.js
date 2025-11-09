import mongoose from "mongoose";
import bcrypt from "bcrypt";// for hashing passwords
import jwt from "jsonwebtoken";// for generating JSON Web Tokens for authentication

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [ 6, 'Email must be at least 6 characters long' ],
        maxLength: [ 50, 'Email must not be longer than 50 characters' ]
    },

    password: {
        type: String,
        select: false,
    }
})


userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//jwt.sign(payload, secretOrPrivateKey, options)
// This is a call to jsonwebtoken's sign function. It creates the JWT string.
// payload: { email: this.email } — the data encoded in the token (claims). Here the token includes only the user's email.
// secretOrPrivateKey: process.env.JWT_SECRET — the secret used to sign the token (must be kept secret).
// options: { expiresIn: '24h' } — sets token expiry to 24 hours.
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
} 


const User = mongoose.model('user', userSchema);

export default User;