const fs   = require('fs');
const path = require('path');

const relationsFile = path.join(__dirname, '../data/relations.json');

function authorize(resourceType, paramName, relation = 'owner') {

  return (req, res, next) => {
    const subject = `user:${req.user.id}`;

    const object=`${resourceType}:${req.params[paramName]}`;

    const relations=JSON.parse(fs.readFileSync(relationsFile, 'utf8'));

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