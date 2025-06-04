const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const appsFile = path.join(__dirname, '../data/apps.json');
const relationsFile = path.join(__dirname, '../data/relations.json');

let apps = require(appsFile);
let relations = require(relationsFile);
var errorMessage = '';

// Helper: escreve no ficheiro
function saveAppsToFile() {
    fs.writeFileSync(appsFile, JSON.stringify(apps, null, 2));
}

function saveRelstionsToFIle() {
    fs.writeFileSync(relationsFile, JSON.stringify(relations, null, 2));
}

function verifyError(name, description) {
    if(!name && !description) {
        errorMessage = 'App name and description are required.';
        return false;
    }
    if (!name) {
        errorMessage = 'App name is required.';
        return false;
    }
    if (!description) {
        errorMessage = 'App description is required.';
        return false;
    }
    return true;
}

function verifyExistsAppName(name) {
    const appExists = apps.find(app => app.name === name);

    if (appExists) {
        errorMessage = 'App name already exists.';
        return false;
    }
    return true;
}

// POST /app
exports.createApp = (req, res) => {
    const { name, description } = req.body;

    if (!verifyError(name, description)) {
        return res.status(400).json({ error: errorMessage });
    }

    if (!verifyExistsAppName(name)) {
        return res.status(400).json({ error: errorMessage });
    }

    const newApp = {
        id: uuidv4(),
        name,
        description: description || '',
        createdAt: new Date().toISOString()
    };

    apps.push(newApp);
    saveAppsToFile();

    relations.push({
        subject:  `user:${req.user.id}`,
        relation: 'owner',
        object:   `app:${newApp.id}`
    });
    saveRelstionsToFIle();

    res.status(201).json({ message: 'App created.', app: newApp });
};

// GET /apps
exports.getAllApps = (req, res) => {
    res.json(apps);
};