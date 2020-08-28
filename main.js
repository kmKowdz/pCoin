const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
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
pCoin.addBlock(new Block(1, "10/07/2017", {amount: 4}));
pCoin.addBlock(new Block(2, "12/07/2017", {amount: 10}));

//check whether the blockchain is valid
console.log("Is Blockchain valid? " + pCoin.isChainValid());

//tamper the block
//change the data
pCoin.chain[1].data = { amount: 100 };
//recalculate hash
pCoin.chain[1].hash = pCoin.chain[1].calculateHash();

//recheck if the blockchain is valid
console.log("Is Blockchain valid? " + pCoin.isChainValid());