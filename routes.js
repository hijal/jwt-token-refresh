const express = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');
const config = require('./config.json');
const router = express.Router();

//locally storing data.
const DB = {};

router.get('/', authenticate, (req, res, next) => {
  res.json({
    error: false,
    ['refresh-token-counter']: DB.refreshTokenCounter,
  });
});

router.post('/login', (req, res, next) => {
  const token = jwt.sign(req.body, config.secret, {
    expiresIn: config.tokenLife,
  });

  const refreshToken = jwt.sign(req.body, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenLife,
  });

  const resp = {
    error: false,
    status: 'Logged in',
    ['access-token']: token,
    ['refresh-token']: refreshToken,
  };

  //storing data into an object
  DB.refreshToken = resp;
  //add a counter for generating new access token
  DB.refreshTokenCounter = 0;

  res.status(200).json(resp);
});

router.post('/token', (req, res, next) => {
  const refreshToken = Object.keys(req.body)[2];
  
  if (refreshToken && refreshToken in DB) {
    const user = {
      email: req.body.email,
      name: req.body.name,
    };
    const token = jwt.sign(user, config.secret, {
      expiresIn: config.tokenLife,
    });

    const resp = {
      error: false,
      ['access-token']: token,
    };

    DB.refreshToken.token = token;
    DB.refreshTokenCounter += 1;

    res.status(200).json(resp);
  } else {
    res.status(404).send({
      error: true,
      message: 'Invalid request',
    });
  }
});

router.get('/posts', authenticate, (req, res, next) => {
  res.status(200).json({
    error: false,
    data: [
      {
        userId: 1,
        id: 1,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      },
      {
        userId: 1,
        id: 2,
        title: 'qui est esse',
        body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
      },
    ],
  });
});

module.exports = router;
