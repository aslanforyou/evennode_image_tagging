require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const bodyParser = require('body-parser');
const config = require('./config/config');
const appRouter = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const connection = mongoose.connect(config.mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: config.mongoUser,
    pass: config.mongoPass
  });

connection.catch(err => {
  console.log('DEBUGG mongo err ', err);
});


app.use(express.static('./public'));

app.use('/api', appRouter);

app.listen(port, () => {
  console.log('DEBUGG app listen ', port);
});
