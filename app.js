const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const constants = require('./config/constants')

mongoose.connect('mongodb+srv://'+process.env.MONGO_ALTAS_USERNAME+':' + process.env.MONGO_ALTAS_PASSWORD + '@cluster0.zt3ix.mongodb.net/shop?retryWrites=true&w=majority', {
    // useMongoClient: true
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const port = constants.PORT || 3000
const server = http.createServer(app);

const routes = require('./routes');

// morgan
app.use(morgan('dev'))

// cors
app.use(cors());

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Make Public folder
app.use('/uploads', express.static('uploads'));

// Include Route
routes(app);
// app.use(routes);

module.exports = app;

server.listen(port, () => {
    console.log(`Server running on ${port}`);
});