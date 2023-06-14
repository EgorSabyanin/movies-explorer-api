const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, DB_CONNECTION = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

const router = require('./routes/index');

app.use(express.json());

app.use(router);

app.use(errors());

// Подключение к БД
mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('База данных успешно подключена.');
}).catch((error) => {
  console.error(`Ошибка при подключении к БД: ${error}`);
});

// Запуск сервера
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Сервер столкнулся с ошибкой при запуске — ${error}`);
    return;
  }
  console.info(`Сервер был запущен на порту: ${PORT}`);
});
