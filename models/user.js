const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальное количество символов — 2.'],
    maxlength: [30, 'Максимальное количество символов — 30.'],
    required: [true, 'Поле имени пользователя обязательно к заполнению.'],
  },
  password: {
    type: String,
    required: [true, 'Поле пароля пользователя обязательно к заполнению.'],
    select: false,
  },
  email: {
    type: String,
    unique: [true, 'Такой адрес электронной почты уже занят, выберите другой.'],
    required: [true, 'Поле электронной почты обязательно к заполнению.'],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный адрес электронной почты.',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
