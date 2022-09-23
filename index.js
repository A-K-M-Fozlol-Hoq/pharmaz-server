require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const mgConnect = require('./config/db');
const router = require('./router');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const axios = require('axios');

// Creating APP and PORT
const app = express();
const port = process.env.PORT || 5000;

// // VERIFY TOKEN SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
});

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert({
//     type: process.env.FIREBASE_TYPE,
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: process.env.FIREBASE_AUTH_URI,
//     token_uri: process.env.FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url:
//       process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
//   }),
//   databaseURL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bexu61a.mongodb.net/?retryWrites=true&w=majority`,
// });

// const verifyTokenMiddleware = async (req, res, next) => {
//   // if (req.headers?.authorization?.startsWith('Bearer ')) {
//   //   const token = req.headers.authorization?.split(' ')[1];
//   //   console.log(token, firebaseAdmin);
//   //   try {
//   //     const decodedUser = await firebaseAdmin.auth().verifyIdToken(token);
//   //     console.log(decodedUser, 'decodedUser.email');
//   //     req.body.decodedEmail = decodedUser.email;
//   //   } catch (err) {
//   //     // throw new Error(err);
//   //     console.log(err);
//   //     // next(createError(401, 'Please send valid token at header!'));
//   //   }
//   // }
//   // next();
//   const options = {
//     method: 'GET',
//     url: `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`,
//   };

//   // Followers List Save By Exports Selected Count
//   axios
//     .request(options)
//     .then(async (response) => {
//       console.log(response, 'response');
//       const publicKeys = JSON.parse(response);
//       console.log(publicKeys, 'publicKeys');
//       const header64 = req.headers.authorization?.split(' ')[1];
//       const header = JSON.parse(
//         Buffer.from(header64, 'base64').toString('ascii')
//       );
//       const op = jwt.verify(token, publicKeys[header.kid], {
//         algorithms: ['RS256'],
//       });
//       console.log(op);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
const verifyTokenMiddleware = async (req, res, next) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token, admin);
    try {
      console.log(
        process.env.FIREBASE_TYPE,
        process.env.FIREBASE_PROJECT_ID,
        process.env.FIREBASE_PRIVATE_KEY_ID
      );
      const decodedUser = await admin.auth().verifyIdToken(token);
      // const decodedUser = await admin.auth().ge
      console.log(decodedUser, 'decodedUser.email');
      // req.body.decodedEmail = decodedUser.email;
    } catch (err) {
      // throw new Error(err);
      console.log(err);
      // next(createError(401, 'Please send valid token at header!'));
    }
  }
  next();
};

const checkIfAuthenticated = async (req, res, next) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization?.split(' ')[1];

    const options = {
      method: 'GET',
      url: `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`,
    };

    // Followers List Save By Exports Selected Count
    axios
      .request(options)
      .then(async (response) => {
        console.log(response, 'response');
        const publicKeys = JSON.parse(response);
        console.log(publicKeys, 'publicKeys');
        const header64 = req.headers.authorization?.split(' ')[1];
        const header = JSON.parse(
          Buffer.from(header64, 'base64').toString('ascii')
        );
        const op = jwt.verify(token, publicKeys[header.kid], {
          algorithms: ['RS256'],
        });
        console.log(op);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  next();
};

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
app.post('/test', checkIfAuthenticated, (req, res) => {
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
