const express = require('express');
const { readFile, writeFile } = require('../utils/manipulateFile');
const auth = require('../middlewares/auth');
const {
  validateName,
  validateAge,
  validateTalk,
} = require('../middlewares/validateTalker');

const router = express.Router();

router.get('/', async (_request, response) => {
  const talkers = await readFile();
  if (!talkers) {
    return response.status(200).send([]);
  }
  response.status(200).send(talkers);
});

router.get('/search', auth, async (request, response) => {
  const { q, rate } = request.query;
  const talkers = await readFile();
  let filteredTalkers = talkers;
  const regexRate = /^[1-5]$/;
  const mess = { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' };
  const nameFilter = (talker) => talker.name.includes(q);
  const rateFilter = (talker) => talker.talk.rate === Number(rate);
  if (q) filteredTalkers = filteredTalkers.filter(nameFilter);
  if (rate) {
    if (!regexRate.test(rate)) return response.status(400).send(mess);
    filteredTalkers = filteredTalkers.filter(rateFilter);
  } 
  const result = response.status(200).send(filteredTalkers);
  const noResult = response.status(200).send([]);
  return filteredTalkers.length > 0 ? result : noResult;
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