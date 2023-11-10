const path = require('path');
const fs = require('fs').promises;

const arquivo = '../talker.json';

const readFile = async () => {
  const data = await fs.readFile(path.resolve(__dirname, arquivo));
  const talkers = JSON.parse(data);
  return talkers;
};

const writeFile = async (talkers) => {
  await fs.writeFile(path.resolve(__dirname, arquivo), JSON.stringify(talkers));
};

module.exports = {
  readFile,
  writeFile,
};