const fs   = require('fs');
const path = require('path');

const relationsFile = path.join(__dirname, '../data/relations.json');
const appsFile = path.join(__dirname, '../data/apps.json');

function authorize(resourceType, paramName, relation = 'owner') {

  return (req, res, next) => {
    const subject = `user:${req.user.id}`;

    const object=`${resourceType}:${req.params[paramName]}`;

    const relations=JSON.parse(fs.readFileSync(relationsFile, 'utf8'));

    const apps=JSON.parse(fs.readFileSync(appsFile, 'utf8'));

    if (!apps.some(r => r.id == req.params[paramName]))
      return res
        .status(404)
        .json({ error: 'App não encontrado.' });

    const allowed = relations.some(r =>
      r.subject === subject &&
      r.object === object  &&
      r.relation === relation
    );

    if (!allowed) {
      return res
        .status(403)
        .json({ error: 'Acesso negado (ReBAC).' });
    }
    next();
  };
}

module.exports = authorize;