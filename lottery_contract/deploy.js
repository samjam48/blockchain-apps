const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'key mix blush pole brand april shed gown emerge stuff horse paper',
    'https://rinkeby.infura.io/2uLY7asRwYR8AIrXRisS'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('attempting to deply from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x' + bytecode })
        .send({ gas: '1000000', from: accounts[0 ]})

    console.log(interface)
    console.log('Contract deployed to', result.options.address);
};
deploy();



// I did this instead and it solved my problem: 

// npm uninstall truffle-hdwallet-provider
// npm install --save truffle-hdwallet-provider@0.0.3
// I got this answer from this thread:
// https://stackoverflow.com/questions/50201353/unhandledpromiserejectionwarning-error-the-contract-code-couldnt-be-stored-p