const express = require('express');
const fs = require('node:fs').promises;
const path = require('path');

const router = express.Router();

router.get('/', async (_request, response) => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const talkers = JSON.parse(data);

    if (!talkers) return response.status(200).send([]);

    response.status(200).send(talkers);
  } catch (err) {
    response.status(500).send({ message: err.message });
  }
});

module.exports = router;