const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//single transaction datatype
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    //add a function to sign the transactions for validity
    //calculate the hash of the transaction
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    //sign the transaction
    signTransaction(signingKey){ //signingkey will receive the object key from the keygenerator

        //check if the public key equals the from address
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transaction for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');

    }

    //to verify if our transaction has been correctly signed
    isValid(){

        //check if the fromAddress is null in reference to the mining rewards parameter
        if(this.fromAddress === null) return true;

        //check if there is a signature for a transaction
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        //if not null, then we need to check whether it contains the correct key
        //create a new publicKey
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        //verify that the hash has been signed by the signature
        return publicKey.verify(this.calculateHash(), this.signature);
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

//export the classes so we can use/call it in the main.js
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
