const connectToMongo = require('./db')
const cors = require('cors')
const express = require("express");
const app = express();
const port = 5000;
const bodyparser = require('body-parser')

connectToMongo();

app.use(express.static('static'))
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
app.use(express.json());


// Available routes
app.use('/users', require('./routes/user'))

app.get('/', (req, res) => {
    res.redirect('/users')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Server started on  port ${port}`);
})