import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

//middleware to authenticate user using JWT and Redis for token blacklisting
export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlackListed = await redisClient.get(token);//Redis is used here to store blacklisted tokens (for example, when a user logs out) so if a token is found in Redis, it means it's blacklisted.

        if (isBlackListed) {

            res.cookie('token', '');//If token is found in Redis, the user is not allowed to continue → cookie cleared → Unauthorized returned.

            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);//token verification using jwt secrwet
        req.user = decoded;//info is attached to req.user, so next routes know who the logged-in user is.
        next();//Continue to protected route if valid
    } catch (error) {

        console.log(error);

        res.status(401).send({ error: 'Unauthorized User' });
    }
}