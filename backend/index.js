import express from 'express';
import { configDotenv } from 'dotenv';
import connectDB from './utils/db.config.js';
import userRoutes from './routes/user.routes.js';
configDotenv();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 4000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
