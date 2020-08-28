const SHA256 = require('crypto-js/sha256');

//single transaction datatype
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0; //a random no. that doesn't have anything to do with your block but it can be changed to something random
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //add a proof of work to signify that you've put a lot of work in creating a block--also known as mining
    //in bitcoin, mining requires the hash to begin with a certain amount of 0s 
    //and because you can't influence the output of the hash function, you simply have to try a lot of combinations and hope to get
    //lucky with a hash that has sufficient number of 0s in front of it; this requires a lot of computing power
    mineBlock(difficulty){ //difficulty is set so that there is a steady amount of new blocks
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){ //keeps running until the hash starts with enough 0s
            this.nonce++; //increment as long as the hash doesn't start with enough 0s
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; //can be changed in the future
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //array of transactions waiting to be included in the block
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        // will reset the pending transaction
        // in the real world, this can be changed so that the miner can get themselves more coins
        // since it is in p2p, nodes are not going to accept it and will just ignore you
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    //create a method that will add the transaction to the pending transaction array
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    //create a mechanism that checks the balance of a ceertain address 
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){ //if you are the sender
                    balance -= trans.amount; //decrease the amount of balance
                }

                if(trans.toAddress === address){ //if you are the receiver
                    balance += trans.amount; //increase the amount of balance
                }
            }
        }

        return balance;
    }

    //to check the integrity of the chain
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            
            //check if the hash of the current block is not equal to the recalculcated hash
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            //check if the points to the correct previous 
            //check if the current block's previous hash is not equal to the hash of the previous block
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let pCoin = new Blockchain();

pCoin.createTransaction(new Transaction('address1', 'address2', 100));
pCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
pCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', pCoin.getBalanceOfAddress('xaviers-address'));

console.log('\nStarting the miner again...');
pCoin.minePendingTransactions('xaviers-address');

console.log('\n Balance of xavier is', pCoin.getBalanceOfAddress('xaviers-address'));
