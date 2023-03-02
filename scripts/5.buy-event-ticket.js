const { ethers, network } = require("hardhat")
const newTokenId = ""

async function script5(newTokenId) {
    const tokenId = newTokenId //mint first

    const eventContract = await ethers.getContract("EventContract")
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const listing = await nftMarketplace.getListing(eventContract.address, tokenId)
    const listingPrice = listing.price
    console.log(
        `-----------------------SCRIPT5----BUY-TICKET-----------------------------------------`
    )
    console.log("Buying a event ticket...")
    const nftMarketplaceBuyItemtx = await nftMarketplace.buyItem(eventContract.address, tokenId, {
        value: listingPrice,
    })
    const nftMarketplaceBuyItemtxReceipt = await nftMarketplaceBuyItemtx.wait(1)

    // for (const event of nftMarketplaceBuyItemtxReceipt.events) {
    //     console.log(`event: ${event.event}`)
    // }

    console.log(`event: ${nftMarketplaceBuyItemtxReceipt.events[2].event}`)
    console.log(`buyer: ${nftMarketplaceBuyItemtxReceipt.events[2].args[0]}`)
    console.log(`nftAddress: ${nftMarketplaceBuyItemtxReceipt.events[2].args[1]}`)
    console.log(`tokenId: ${nftMarketplaceBuyItemtxReceipt.events[2].args[2]}`)
    console.log(`price: ${nftMarketplaceBuyItemtxReceipt.events[2].args[3]}`)
    console.log(
        `-----------------------SCRIPT5----BUY-TICKET-----------------------------------------`
    )
}

// main(newTokenId)
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

module.exports = script5
