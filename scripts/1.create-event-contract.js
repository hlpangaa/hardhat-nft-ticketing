const { ethers, network } = require("hardhat")

async function main() {
    const _name = "Hin"
    const _symbol = "Hin"
    const _contractURI = "ipfs://Qmf2xvUekEhSrEcG4NCrBWXBFjw11b9wzoRdCq9pQzFVbR"
    const _supplyCap = 3
    const _mintFee = ethers.utils.parseEther("0.1") //100000000000000000
    const _priceCellingFraction = 110
    const _royaltyFeesInBips = 250
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const marketplace = nftMarketplace.address
    if (network.config.chainId == "31337") {
        feeRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        feeRecipient = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"
    }

    const eventFactory = await ethers.getContract("EventFactory")
    console.log("Creating Event Contract...")
    const eventFactoryCreateNFTContractTx = await eventFactory.createNFTContract(
        _name,
        _symbol,
        _contractURI,
        _supplyCap,
        _mintFee,
        _priceCellingFraction,
        _royaltyFeesInBips
    )
    const eventFactoryCreateNFTContractTxReceipt = await eventFactoryCreateNFTContractTx.wait(1)

    /*
    for (const event of eventFactoryCreateNFTContractTxReceipt.events) {
        console.log(event.event)
    }*/

    console.log(`event: ${eventFactoryCreateNFTContractTxReceipt.events[2].event}`)
    console.log(`creator: ${eventFactoryCreateNFTContractTxReceipt.events[2].args[0]}`)
    console.log(`nft: ${eventFactoryCreateNFTContractTxReceipt.events[2].args[1]}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
