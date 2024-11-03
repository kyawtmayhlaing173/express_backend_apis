import express from "express";
import urlsRouter from './routes/urls.js';
import connectDB from './config/db.js';
import indexRouter from './routes/index.js';

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use('/', indexRouter);
app.use('/api', urlsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})