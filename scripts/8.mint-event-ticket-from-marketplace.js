const { ethers, network } = require("hardhat")
// @usage: run below shell command. You can assign 'to' variable for address. The payment currently will be deducted by account 6(minter) by environment variable.
// @script: yarn hardhat run 'scripts/3.mint-event-ticket.js' --network goerli
//

async function script8() {
    if (network.config.chainId == "31337") {
        to = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        to = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8" // goerli account 6
        //to = "0xf06EbE55f79bd62380e73bb040f6E954a824957e" // goerli account 2
        // to = "0x29B3555cE30A36F042Fb864866CE35ba2b63F25F" // goerli account 1
    }
    //const _mintFee = ethers.utils.parseEther("0.1")

    const eventContract = await ethers.getContract("EventContract")
    const nftMarketPlace = await ethers.getContract("NftMarketplace")
    const mintprice = await eventContract.mintFee()
    console.log(
        `-----------------------SCRIPT8----MINT-NFT-FROM-MARKETPLACE-----------------------------------------`
    )
    console.log(`mintPrice: : ${mintprice.toString()}`)

    console.log("Minting a event ticket from the marketplace...")
    const nftMarketPlacemintFromMarketplaceTx = await nftMarketPlace.mintFromMarketplace(
        to,
        eventContract.address,
        {
            value: mintprice,
        }
    )
    const nftMarketPlacemintFromMarketplaceTxReceipt =
        await nftMarketPlacemintFromMarketplaceTx.wait(1)

    // for (const event of nftMarketPlacemintFromMarketplaceTxReceipt.events) {
    //     console.log(`event: ${event.event}`)
    // }
    console.log(`event: ${nftMarketPlacemintFromMarketplaceTxReceipt.events[1].event}`)
    console.log(`newTokenId: ${nftMarketPlacemintFromMarketplaceTxReceipt.events[1].args[0]}`)
    console.log(`_to: ${nftMarketPlacemintFromMarketplaceTxReceipt.events[1].args[1]}`)
    console.log(`msg.sender: ${nftMarketPlacemintFromMarketplaceTxReceipt.events[1].args[2]}`)
    console.log(
        `-----------------------SCRIPT8----MINT-NFT-FROM-MARKETPLACE-----------------------------------------`
    )
}

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

module.exports = script8
