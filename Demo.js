console.log("Hello, This is a BlockChain Demo.")
const sha256=require('crypto-js/sha256')

class Block{
    constructor(data,previousHash){
        this.data=data
        this.previousHash=previousHash
        this.hash=this.computeHash()
    }

    computeHash(){
        return sha256(this.data+this.previousHash).toString()
    }
}


class Chain{
    constructor(){
        this.chain=[this.bigBang()]
    }

    bigBang(){
        const genesisBlock = new Block("我是祖先",'')
        return genesisBlock
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
    addBlockChain(newBlock){
        //找到最近一个block的Hash,作为新区块的previousHash
        newBlock.previousHash=this.getLatestBlock().hash
        newBlock.hash=newBlock.computeHash()
        this.chain.push(newBlock)
    }

    validateChain(){
        if(this.chain.length===1){
            return this.chain[0].hash===this.chain[0].computeHash()
        }
        //下面是从第二个区块开始验证
        for(let i=1;i<= this.chain.length-1;i++){
            const blockToValidate=this.chain[i]
            if(blockToValidate.hash !== blockToValidate.computeHash()){
                console.log('数据篡改')
                return false
            }
            const previousBlock=this.chain[i-1]
            if(blockToValidate.previousHash !== previousBlock.hash){
                console.log("区块断裂")
                return false
            }
        }

        return "区块链无误"
    }
}

const MyChain= new Chain()
const block1 = new Block("转账10元","")
const block2 = new Block("转账100元","")
MyChain.addBlockChain(block1)
MyChain.addBlockChain(block2)

MyChain.chain[1].data="转账300元"
MyChain.chain[1].hash=MyChain.chain[1].computeHash()
console.log(MyChain)
console.log(MyChain.validateChain())