// controllers/passwordController.js
const { v4: uuidv4 } = require('uuid');
const fs   = require('fs');
const path = require('path');

const passwordsFile = path.join(__dirname, '../data/passwords.json');

/**
 * Lê do disco o array de senhas.
 * Se o arquivo não existir, retorna um array vazio.
 */
function loadPasswords() {
  try {
    const raw = fs.readFileSync(passwordsFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

/**
 * Persiste no disco o array de senhas.
 */
function savePasswords(passwords) {
  fs.writeFileSync(passwordsFile, JSON.stringify(passwords, null, 2), 'utf8');
}

exports.createPassword = (req, res) => {
  const { appid } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'O campo password é obrigatório.' });
  }

  const passwords = loadPasswords();

  // Verifica se já existe uma senha para este appid
  if (passwords.some(entry => entry.appid === appid)) {
    return res.status(409).json({ error: 'Password already exists.' });
  }

  const newEntry = { id: uuidv4(), appid, password };
  passwords.push(newEntry);
  savePasswords(passwords);

  return res.status(201).json(newEntry);
};

exports.getPassword = (req, res) => {
  const { appid } = req.params;
  const passwords = loadPasswords();

  // Busca a entrada que tenha o mesmo appid
  const entry = passwords.find(entry => entry.appid === appid);
  if (!entry) {
    return res.status(404).json({ error: 'Password not found.' });
  }

  return res.json(entry);
};

exports.updatePassword = (req, res) => {
  const { appid } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'O campo password é obrigatório.' });
  }

  const passwords = loadPasswords();
  const entry = passwords.find(entry => entry.appid === appid);
  if (!entry) {
    return res.status(404).json({ error: 'Password not found.' });
  }

  entry.password = password;
  savePasswords(passwords);

  return res.json(entry);
};
