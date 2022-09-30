require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mgConnect = require('./config/db');
const router = require('./router');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const axios = require('axios');
const {
  verifyCustomTokenMiddleware,
} = require('./middlewares/verifyCustomToken');

// Creating APP and PORT
const app = express();
const port = process.env.PORT || 5000;

// MIDDLE WARES
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use(bodyParser.json());

app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/test', verifyCustomTokenMiddleware, (req, res) => {
  res.send({ ok: req.body });
});
// app.post('/test', verifyTokenMiddleware, (req, res) => {
//   res.send({ ok: req.body });
// });

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

mgConnect
  .then(() => console.log(`Alhamdulillah, mongo-DB connected`))
  .catch((e) => console.log(e));

app.listen(port, () => {
  console.log(`Pharmaz server listening on port ${port}`);
});
