const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

const passwordController = require('../controllers/passwordController');
const passwords = require('../data/passwords.json');

function mockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe('passwordController.createPassword()', () => {
  let writeStub;

  beforeEach(() => {
    writeStub = sinon.stub(fs, 'writeFileSync');
    for (const key in passwords) delete passwords[key];
  });

  afterEach(() => {
    writeStub.restore();
  });

  it('[IF] Deve criar uma nova password se não existir', () => {
    const req = { params: { appid: 'app1' }, body: { password: '1234' } };
    const res = mockResponse();

    passwordController.createPassword(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Password created.' })).to.be.true;
    expect(passwords).to.have.property('app1');
  });

  it('[IF] Deve falhar se a password já existir', () => {
    passwords['app1'] = { id: 'abc', password: '1234' };

    const req = { params: { appid: 'app1' }, body: { password: 'nova' } };
    const res = mockResponse();

    passwordController.createPassword(req, res);

    expect(res.status.calledWith(409)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'Password already exists.' })).to.be.true;
  });
});

describe('passwordController.updatePassword()', () => {
  let writeStub;

  beforeEach(() => {
    writeStub = sinon.stub(fs, 'writeFileSync');
    passwords['app2'] = { id: 'def', password: 'old' };
  });

  afterEach(() => {
    writeStub.restore();
    delete passwords['app2'];
  });

  it('[IF] Deve atualizar a password se existir', () => {
    const req = { params: { appid: 'app2' }, body: { password: 'newpass' } };
    const res = mockResponse();

    passwordController.updatePassword(req, res);

    expect(res.json.calledWithMatch({ message: 'Password updated.' })).to.be.true;
    expect(passwords['app2'].password).to.equal('newpass');
  });

  it('[IF] Deve falhar se a password não existir', () => {
    delete passwords['app2'];
    const req = { params: { appid: 'app2' }, body: { password: 'newpass' } };
    const res = mockResponse();

    passwordController.updatePassword(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'Password not found.' })).to.be.true;
  });
});

describe('passwordController.getPassword()', () => {
  beforeEach(() => {
    passwords['app3'] = { id: 'ghi', password: 'secret' };
  });

  afterEach(() => {
    delete passwords['app3'];
  });

  it('Deve retornar a password se existir', () => {
    const req = { params: { appid: 'app3' } };
    const res = mockResponse();

    passwordController.getPassword(req, res);

    expect(res.json.calledWithMatch({ id: 'ghi', password: 'secret' })).to.be.true;
  });

  it('Deve retornar erro se a password não existir', () => {
    const req = { params: { appid: 'naoexiste' } };
    const res = mockResponse();

    passwordController.getPassword(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'Password not found.' })).to.be.true;
  });
});
