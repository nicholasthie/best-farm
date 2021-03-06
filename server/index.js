const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const routes = require('./routes/routes');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// connect to the database
mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));

// since mongoose promise is deprecated,we override it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.use(compression());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

// Adds the react production build to serve react requests
app.use(express.static(path.join(__dirname, '../build')));

// React root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './../build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
