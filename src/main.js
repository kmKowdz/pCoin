const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('b7b41b819e38123971c5ca44c4db4a3a397e486fa5bfff784e2e6ba26b913009');
const myWalletAddress = myKey.getPublic('hex');

let pCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'address 2', 10);
tx1.signTransaction(myKey);
pCoin.addTransaction(tx1);

console.log('\nStarting the miner...');
pCoin.minePendingTransactions(myWalletAddress);

const tx2 = new Transaction(myWalletAddress, 'address 1', 5);
tx2.signTransaction(myKey);
pCoin.addTransaction(tx2);

console.log('\nStarting the miner again...');
pCoin.minePendingTransactions(myWalletAddress);

console.log();
console.log('\nBalance of miner is', pCoin.getBalanceOfAddress(myWalletAddress));