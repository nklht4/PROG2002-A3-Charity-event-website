
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const apiController = require('./api-controller/api-controller');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', apiController);


app.use((req, res) => res.status(404).json({ msg: 'Route not found' }));


const PORT = 3030;
app.listen(PORT, () => console.log(`Server ready: http://localhost:${PORT}`));