const express = require('express');
const { readFile, writeFile } = require('../utils/manipulateFile');
const auth = require('../middlewares/auth');
const { validateName, validateAge, validateTalk } = require('../middlewares/validateTalker');

const router = express.Router();

router.get('/', async (_request, response) => {
  const talkers = await readFile();
  if (!talkers) {
    return response.status(200).send([]);
  }
  response.status(200).send(talkers);
});

router.get('/:id', async (request, response) => {
  const { id } = request.params;
  const talkers = await readFile();
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
  const talkers = await readFile();
  const talker = {
    id: talkers.length + 1,
    name,
    age,
    talk,
  };
  const newTalkers = [...talkers, talker];
  await writeFile(newTalkers); 
  response.status(201).send(talker);
});

router.put('/:id', auth, validateName, validateAge, validateTalk, async (request, response) => {
  const { id } = request.params;
  const { name, age, talk } = request.body;
  const talkers = await readFile();
  const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
  if (talkerIndex === -1) {
    return response.status(404).send({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  const newTalker = {
    id: talkers[talkerIndex].id,
    name,
    age,
    talk,
  };
  talkers[talkerIndex] = newTalker;
  await writeFile(talkers);
  return response.status(200).send(newTalker);
});

router.delete('/:id', auth, async (request, response) => {
  const { id } = request.params;
  const talkers = await readFile();
  const filteredTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await writeFile(filteredTalkers);
  response.status(204).send({
    message: 'Pessoa palestrante deletada com sucesso',
  });
});

module.exports = router;