const express = require('express');
require('express-async-errors');

const talkerRoutes = require('./routes/talkerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const { validadeEmail, validatePassword } = require('./middlewares/validatelogin');

const app = express();
app.use(express.json());
app.use('/talker', talkerRoutes);
app.use('/login', validadeEmail, validatePassword, loginRoutes);

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use((error, _req, res, _next) => res.status(500).json({ error: error.message }));

app.listen(PORT, () => {
  console.log('Online');
});
