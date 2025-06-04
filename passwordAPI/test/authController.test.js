const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const authController = require('../controllers/authController');
const users = require('../data/users.json');

const logger = require('../middleware/logger');

function mockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe('authController.login()', () => {
  it('[IF] Deve falhar se username ou password estiverem ausentes', () => {
    const req = { body: {} };
    const res = mockResponse();

    authController.login(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'Username e password são obrigatórios.' })).to.be.true;
  });

  it('[IF] Deve falhar se credenciais forem inválidas', () => {
    const req = { body: { username: 'invalido', password: '1234' } };
    const res = mockResponse();

    authController.login(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'Credenciais inválidas.' })).to.be.true;
  });

  it('[IF] Deve retornar um token se as credenciais forem válidas', () => {
    const user = users[0]; // Assume que users.json tem pelo menos um utilizador válido
    const req = { body: { username: user.username, password: user.password } };
    const res = mockResponse();

    authController.login(req, res);

    expect(res.json.calledOnce).to.be.true;
    const responseData = res.json.firstCall.args[0];
    expect(responseData).to.have.property('token');
    const decoded = jwt.verify(responseData.token, 'jwtSecret');
    expect(decoded.username).to.equal(user.username);
  });
});

describe('login() com mock de logger', () => {
  let logInfoStub;

  beforeEach(() => {
    logInfoStub = sinon.stub(logger, 'logInfo');
  });

  afterEach(() => {
    logInfoStub.restore();
  });

  it('Deve chamar logger.logInfo ao fazer login com sucesso', () => {
    const user = users[0]; // assume que existe um user
    const req = { body: { username: user.username, password: user.password } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    loginController.login(req, res);

    expect(logInfoStub.calledOnce).to.be.true;
    expect(logInfoStub.firstCall.args[0]).to.include(user.username);
  });
});