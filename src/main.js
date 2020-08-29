//import the Blockchain and Transaction classes from blockchain.js
const {Blockchain, Transaction} = require('./blockchain');

let pCoin = new Blockchain();

pCoin.createTransaction(new Transaction('address1', 'address2', 100));
pCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
pCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', pCoin.getBalanceOfAddress('xaviers-address'));

console.log('\nStarting the miner again...');
pCoin.minePendingTransactions('xaviers-address');

console.log('\n Balance of xavier is', pCoin.getBalanceOfAddress('xaviers-address'));
