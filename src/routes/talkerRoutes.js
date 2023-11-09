const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const arquivo = '../talker.json';

router.get('/', async (_request, response) => {
  const data = await fs.readFile(path.resolve(__dirname, arquivo));
  const talkers = JSON.parse(data);

  if (!talkers) return response.status(200).send([]);

  response.status(200).send(talkers);
});

router.get('/:id', async (request, response) => {
  const { id } = request.params;
  const data = await fs.readFile(path.resolve(__dirname, arquivo));
  const talkers = JSON.parse(data);
  const filteredTalker = talkers.find((talker) => talker.id === Number(id));

  if (!filteredTalker) {
    return response.status(404).send({
      message: 'Pessoa palestrante não encontrada',
    }); 
  }

  response.status(200).send(filteredTalker);
});
module.exports = router;