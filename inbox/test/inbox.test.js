const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

const message = 'Hi there Theo';
let accounts;

beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: ['Hi there Theo']
        })
        .send({ from: accounts[0], gas: '1000000' })

    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // check that contract has an address
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there Theo')
    });

    it('can change the message'. async () =>  {
        await inbox.methods.setMessage('byeee').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    })
});


// infura api key = 2uLY7asRwYR8AIrXRisS

