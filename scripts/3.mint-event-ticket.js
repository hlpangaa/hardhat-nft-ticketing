const { ethers, network } = require("hardhat")

async function main() {
    const to = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8" //goerli
    //const to = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" //hardhat
    const tokenUri = "ipfs://QmPFmytBjskRqaFeBWq3Ub41sL9JMrGPAejTQcybJMMupP"

    const eventContract = await ethers.getContract("EventContract")
    console.log("Minting a event ticket...")
    const eventContractMintTx = await eventContract.mint(to, tokenUri)
    const eventContractMintTxReceipt = await eventContractMintTx.wait(1)
    /*
    for (const event of eventContractMintTxReceipt.events) {
        console.log(`event: ${event.event}`)
    }
*/
    console.log(`event: ${eventContractMintTxReceipt.events[1].event}`)
    console.log(`tokenId: ${eventContractMintTxReceipt.events[1].args[0]}`)
    console.log(`beneficiary: ${eventContractMintTxReceipt.events[1].args[1]}`)
    console.log(`tokenUri: ${eventContractMintTxReceipt.events[1].args[2]}`)
    console.log(`minter: ${eventContractMintTxReceipt.events[1].args[3]}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
