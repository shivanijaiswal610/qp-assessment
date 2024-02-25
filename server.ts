require('dotenv').config()
require('./db.connection')
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const routes = require('./routes/index');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
