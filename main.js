const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
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
        console.log("Block mined: " + this.hash);
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; //can be changed in the future
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty); //to calculate a hash different from the regular hash; used the difficulty as parameter to add difficulty in obtaining a hash with a nonce (leading 0s in front of the hash)
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

console.log('Mining block 1...');
pCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));

console.log('Mining block 2...');
pCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 })); 