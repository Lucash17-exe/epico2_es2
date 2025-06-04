const { expect } = require('chai');
const sinon = require('sinon');
const appController = require('../controllers/appController');
const apps = require('../data/apps.json');
const relations = require('../data/relations.json');

function mockResponse() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe('createApp()', () => {

  beforeEach(() => {
    apps.length = 0;
    relations.length = 0;
  });

  it('[IF] Deve falhar se name e description estiverem ausentes', () => {
    const req = { body: {}, user: { id: 'user1' } };
    const res = mockResponse();

    appController.createApp(req, res);

    expect(res.status.calledWith(400)).to.be.true;  
    expect(res.json.calledWithMatch({ error: 'App name and description are required.' })).to.be.true;
  });

  it('[IF] Deve falhar se apenas name estiver ausente', () => {
    const req = { body: { description: "Desc" }, user: { id: 'user1' } };
    const res = mockResponse();

    appController.createApp(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'App name is required.' })).to.be.true;
  });

  it('[IF] Deve falhar se apenas description estiver ausente', () => {
    const req = { body: { name: "MyApp" }, user: { id: 'user1' } };
    const res = mockResponse();

    appController.createApp(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'App description is required.' })).to.be.true;
  });

  it('[IF] Deve criar a app corretamente se os dados forem válidos', () => {
    const req = { body: { name: "UniqueAppName", description: "Test Desc" }, user: { id: 'user1' } };
    const res = mockResponse();

    appController.createApp(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'App created.' })).to.be.true;
    expect(apps.length).to.equal(1);
    expect(relations.length).to.equal(1);
    expect(apps[0].name).to.equal("UniqueAppName");
  });

  it('[IF] Deve falhar se o nome da app já existir', () => {
    const req1 = { body: { name: "RepeatedApp", description: "Primeira app" }, user: { id: 'user1' } };
    const res1 = mockResponse();
    appController.createApp(req1, res1);

    const req2 = { body: { name: "RepeatedApp", description: "Segunda tentativa" }, user: { id: 'user1' } };
    const res2 = mockResponse();
    appController.createApp(req2, res2);

    expect(res2.status.calledWith(400)).to.be.true;
    expect(res2.json.calledWithMatch({ error: 'App name already exists.' })).to.be.true;
  });

});

describe('getAllApps()', () => {

  beforeEach(() => {
    apps.length = 0;
    apps.push(
      { id: '1', name: 'App1', description: 'Desc1', createdAt: new Date().toISOString() },
      { id: '2', name: 'App2', description: 'Desc2', createdAt: new Date().toISOString() }
    );
  });

  it('Deve retornar todas as apps existentes', () => {
    const req = {};
    const res = mockResponse();

    appController.getAllApps(req, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal(apps);
  });

  it('Deve retornar um array vazio se não houver apps', () => {
    apps.length = 0;
    const req = {};
    const res = mockResponse();

    appController.getAllApps(req, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal([]);
  });

});