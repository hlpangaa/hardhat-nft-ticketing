const { ethers, network } = require("hardhat")

async function main() {
    if (network.config.chainId == "31337") {
        to = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        to = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"
    }
    const _mintFee = ethers.utils.parseEther("0.1")

    const eventContract = await ethers.getContract("EventContract")
    console.log("Minting a event ticket...")
    const eventContractMintTx = await eventContract.mint(to, { value: _mintFee })
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
