const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const passwordsFile = path.join(__dirname, '../data/passwords.json');
let passwords = require(passwordsFile);

exports.createPassword = (req, res) => {
    const { appid } = req.params;
    const { password } = req.body;

    if (passwords[appid]) {
        return res.status(409).json({ error: 'Password already exists.' });
    }

    passwords[appid] = { id: uuidv4(), password };
    fs.writeFileSync(passwordsFile, JSON.stringify(passwords, null, 2));
    res.status(201).json({ message: 'Password created.' });
};

exports.updatePassword = (req, res) => {
    const { appid } = req.params;
    const { password } = req.body;

    if (!passwords[appid]) {
        return res.status(404).json({ error: 'Password not found.' });
    }

    passwords[appid].password = password;
    fs.writeFileSync(passwordsFile, JSON.stringify(passwords, null, 2));
    res.json({ message: 'Password updated.' });
};

exports.getPassword = (req, res) => {
    const { appid } = req.params;

    if (!passwords[appid]) {
        return res.status(404).json({ error: 'Password not found.' });
    }

    res.json(passwords[appid]);
};
