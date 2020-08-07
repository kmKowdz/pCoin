const SHA256 = require("crypto-js/sha256");

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
        return new Block(0, "08/07/2020", "Genesis Block", "0");
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

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let pCoin = new Blockchain();
pCoin.addBlock(new Block(1, "08/08/2020", {amount: 1000}));
pCoin.addBlock(new Block(2, "08/09/2020", {amount: 10}));

//check whether the blockchain is valid
console.log("Is Blockchain valid? " + pCoin.isChainValid());

//change the value of the coin and check if it is valid
pCoin.chain[1].data = {amount: 20};
pCoin.chain[1].hash = pCoin.chain[1].calculateHash();
console.log("Is Blockchain valid? " + pCoin.isChainValid());


//console.log(JSON.stringify(pCoin, null, 4));