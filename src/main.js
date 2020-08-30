//import the Blockchain and Transaction classes from blockchain.js
const {Blockchain, Transaction} = require('./blockchain');
// import elliptic library
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//initialize the myKey
const myKey = ec.keyFromPrivate('0929633cbd7fdffad68313360eec7e880383ac9509e6875968d314ba84ba2d1e');
const myWalletAddress = myKey.getPublic('hex');

//create an instance of the blockchain
let pCoin = new Blockchain();

//create a transaction
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
pCoin.addTransaction(tx1);

console.log('\nStarting the miner...');
pCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of xavier is', pCoin.getBalanceOfAddress(myWalletAddress));

console.log('Is chain valid?', pCoin.isChainValid());