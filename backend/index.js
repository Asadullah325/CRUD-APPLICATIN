import express from 'express';
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import { configDotenv } from 'dotenv';
import connectDB from './utils/db.config.js';
import userRoutes from './routes/user.routes.js';
configDotenv();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 4000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
