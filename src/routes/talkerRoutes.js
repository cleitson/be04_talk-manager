const express = require('express');

const router = express.Router();

router.get('/', (_request, response) => {
  response.status(200).send();
});

module.exports = router;