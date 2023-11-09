const express = require('express');
const token = require('../utils/generateToken');

const router = express.Router();

router.post('/', async (request, response) => {
  const randonToken = token();
  response.status(200).send({
    token: randonToken,
  });
});

module.exports = router;