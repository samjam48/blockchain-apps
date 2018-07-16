import Web3 from 'web3';

// create new instance of web3 obj in v1 web3 instead of the browser v0.2 web3
const web3 = new Web3(window.web3.currentProvider);

export default web3;