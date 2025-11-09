import mongoose from "mongoose";//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.It acts as a bridge between your JavaScript code and MongoDB, making database operations simpler and structured.
import 'dotenv/config.js';


function connect(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB", err);
    }); 

}
export default connect;
