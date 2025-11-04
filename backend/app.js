import express from 'express';
import 'dotenv/config.js';
import morgan from 'morgan';
import connect from './db/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
connect();



const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;