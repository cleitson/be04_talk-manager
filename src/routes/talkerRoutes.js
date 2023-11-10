const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const auth = require('../middlewares/auth');
const { validateName, validateAge, validateTalk } = require('../middlewares/validateTalker');

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

router.post('/', auth, validateName, validateAge, validateTalk, async (request, response) => {
  const { name, age, talk } = request.body;
  const data = await fs.readFile(path.resolve(__dirname, arquivo));
  const talkers = JSON.parse(data);
  const talker = {
    id: talkers.length + 1,
    name,
    age,
    talk,
  };
  const newTalkers = [...talkers, talker];
  await fs.writeFile(path.resolve(__dirname, arquivo), JSON.stringify(newTalkers)); 
  response.status(201).send(talker);
});
module.exports = router;