import express from 'express';//A lightweight web framework for Node.js makes super easy to create server-side applications and APIs.
import 'dotenv/config.js';//Loads environment variables from a .env file into process.env, allowing secure management of configuration settings.
import morgan from 'morgan';//A HTTP request logger middleware for Node.js that logs incoming requests in a predefined format, useful for debugging and monitoring.
import connect from './db/db.js';
import cookieParser from 'cookie-parser';//A middleware that helps you read cookies(eg user data(sessionID and tokens)) sent by the client in their browser.needed for authentication
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cors from 'cors';//For example, your React app runs on localhost:5173 and your backend on localhost:5000.Without CORS, the browser blocks requests for security reasons.
connect();//Connects to the database



const app = express();//Creates an Express application instance that serves as the main component for handling HTTP requests and responses.
// app.use(cors());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://student-collab-ai.vercel.app"
];

app.use(cors({
  // origin: "https://student-collab-ai.vercel.app",
  // origin: ["http://localhost:5173", "https://student-collab-ai.vercel.app"],
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//built-in middleware in Express that helps your server parse data sent through HTML forms
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Collabify API is running' }); 
});

export default app;