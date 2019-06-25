#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const DEFAULT_CONFIG_FILEPATH = path.resolve(__dirname, './default_config.json');
const defautConfig = {
  "env": {
    "SPINAL_USER_ID": "168",
    "SPINALHUB_PORT": 7777,
    "SPINALHUB_IP": "127.0.0.1"
  },
  "env_test": {
    "SPINAL_USER_ID": "168",
    "SPINALHUB_PORT": 7777,
    "SPINALHUB_IP": "127.0.0.1"
  },
  "env_production": {
    "SPINAL_USER_ID": "168",
    "SPINALHUB_PORT": 7777,
    "SPINALHUB_IP": "127.0.0.1"
  }
};

var lowercase = 'abcdefghijklmnopqrstuvwxyz',
  uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers = '0123456789';
const pool = "".concat(lowercase, uppercase, numbers);

function genRandomLetter() {
  const maxPool = pool.length;
  const randomNumber = Math.floor(Math.random() * maxPool);
  return pool[randomNumber];
}
function genRandomString(length) {
  let password = '';
  for (let idx = 0; idx < length; idx++) {
    password += genRandomLetter();
  }
  return password;
}

function genPassword(key) {
  const password = genRandomString(12);
  defautConfig.env[key] = password;
  defautConfig.env_test[key] = password;
  defautConfig.env_production[key] = password;
}

genPassword('SPINAL_PASSWORD');
genPassword('SPINAL_PASSWORD_ROOT');
genPassword('SPINAL_PASSWORD_USER');

const data = JSON.stringify(defautConfig, null, 2);
fs.writeFileSync(DEFAULT_CONFIG_FILEPATH, data);
