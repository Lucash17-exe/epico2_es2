const express = require('express');
const authenticate = require('./middleware/authenticate');
const bodyParser = require('body-parser');
const passwordRoute = require('./routes/password');
const appRoute = require('./routes/app');
const loginRoute = require('./routes/auth');
const logger = require('./middleware/logger');

const app = express();
app.use(bodyParser.json());
app.use(logger);

app.use('/password', authenticate, passwordRoute);
app.use('/apps', authenticate, appRoute);
app.use('/login', loginRoute)

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});